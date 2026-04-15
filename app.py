import streamlit as st
import pandas as pd
import psycopg2
import plotly.express as px
import plotly.graph_objects as go
import os
from datetime import datetime

# --- CONFIGURACIÓN DE PÁGINA ---
st.set_page_config(page_title="Fla Analytics - Academia", layout="wide", page_icon="💛")

# --- ESTILOS CSS ---
st.markdown("""
    <style>
    .main { background-color: #ffffff; }
    [data-testid="stMetricValue"] { font-size: 28px; font-weight: bold; color: #1a1a1a; }
    [data-testid="stMetricDelta"] { font-size: 14px; }
    .status-badge {
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: bold;
    }
    </style>
""", unsafe_allow_html=True)

# --- CONEXIÓN A DB ---
def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME", "db_agente"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASS"),
        port=os.getenv("DB_PORT", "5432")
    )

def run_query(query):
    with get_connection() as conn:
        return pd.read_sql(query, conn)

# --- SIDEBAR ---
with st.sidebar:
    st.image("https://cdn-icons-png.flaticon.com/512/3429/3429150.png", width=80)
    st.title("Fla Control")
    menu = st.radio("Secciones", ["📊 Dashboard Principal", "🤖 Inteligencia RAG", "📝 Registro de Leads"])
    st.divider()
    st.info("Conectado a: db_agente")

# --- SECCIÓN 1: DASHBOARD PRINCIPAL ---
if menu == "📊 Dashboard Principal":
    st.title("💛 Clases de Inglés con Fla")

    # KPIs desde v_kpis_mes
    try:
        df_kpis = run_query("SELECT * FROM public.v_kpis_mes LIMIT 1")
        if not df_kpis.empty:
            kpi = df_kpis.iloc[0]
            c1, c2, c3, c4 = st.columns(4)
            with c1: st.metric("Nuevos Leads", kpi['leads_nuevos_mes'], "Este mes")
            with c2: st.metric("Calificados", kpi['leads_calificados'], "Listos para cierre")
            with c3: st.metric("Registrados", kpi['registros'], f"Conversión {kpi['tasa_conversion_pct']}%")
            with c4: st.metric("Ingresos", f"${kpi['ingresos_mes']:,.0f}", f"{kpi['pagos_pendientes']} pagos x verificar")
    except:
        st.warning("⚠️ Sin datos en v_kpis_mes")

    st.divider()

    # Fila de Gráficos
    col_weekly, col_dist = st.columns([2, 1])

    with col_weekly:
        st.subheader("Chats y conversiones por semana")
        try:
            df_sem = run_query("""
                SELECT to_char(date_trunc('week', created_at), 'Sem WW') as semana, COUNT(*) as chats 
                FROM public.conversation_logs GROUP BY 1 ORDER BY 1
            """)
            fig_weekly = go.Figure()
            fig_weekly.add_trace(go.Bar(x=df_sem['semana'], y=df_sem['chats'], name='Interacciones', marker_color='#3498db'))
            fig_weekly.update_layout(barmode='group', height=350, margin=dict(t=10, b=10, l=0, r=0))
            st.plotly_chart(fig_weekly, use_container_width=True)
        except: st.info("Esperando logs de conversación...")

    with col_dist:
        st.subheader("Distribución de leads")
        try:
            df_dist = run_query("SELECT lead_tipo, total FROM public.v_distribucion_leads")
            fig_donut = px.pie(df_dist, values='total', names='lead_tipo', hole=0.7, 
                               color_discrete_sequence=['#FFD700', '#3498db', '#2ecc71', '#e67e22'])
            fig_donut.update_layout(height=350, margin=dict(t=0, b=0, l=0, r=0))
            st.plotly_chart(fig_donut, use_container_width=True)
        except: st.info("Sin datos de clasificación.")

    # Funnel y Últimos Registros
    col_fun, col_list = st.columns([1, 2])

    with col_fun:
        st.subheader("Funnel de Ventas")
        try:
            df_fun = run_query("SELECT etapa, cantidad FROM public.v_funnel_conversion ORDER BY orden")
            fig_fun = px.funnel(df_fun, x='cantidad', y='etapa', color_discrete_sequence=['#9b59b6'])
            st.plotly_chart(fig_fun, use_container_width=True)
        except: st.info("Funnel no disponible.")

    with col_list:
        st.subheader("Últimas consultas atendidas")
        df_rec = run_query("""
            SELECT nombre, lead_tipo as tipo, intencion, estado, completitud 
            FROM public.alumnos ORDER BY ultimo_contacto DESC LIMIT 6
        """)
        st.dataframe(df_rec, use_container_width=True, hide_index=True)

# --- SECCIÓN 2: INTELIGENCIA RAG ---
elif menu == "🤖 Inteligencia RAG":
    st.header("🧠 Rendimiento del Agente (Qdrant + ML)")
    
    col_conf, col_score = st.columns([1, 2])
    
    with col_conf:
        st.subheader("Nivel de Confianza")
        df_conf = run_query("SELECT confianza, COUNT(*) as cant FROM public.rag_logs GROUP BY 1")
        fig_conf = px.pie(df_conf, values='cant', names='confianza', 
                          color='confianza', color_discrete_map={'ALTA':'#2ecc71', 'MEDIA':'#f1c40f', 'BAJA':'#e74c3c'})
        st.plotly_chart(fig_conf, use_container_width=True)

    with col_score:
        st.subheader("Historial de Consultas IA")
        df_rag = run_query("SELECT pregunta, lead_tipo, score_maximo as score, confianza FROM public.rag_logs ORDER BY created_at DESC LIMIT 10")
        st.table(df_rag)

# --- SECCIÓN 3: REGISTRO DE LEADS ---
elif menu == "📝 Registro de Leads":
    st.header("📋 Base de Datos de Potenciales Alumnos")
    df_all = run_query("SELECT nombre, whatsapp, lead_tipo, kids_colegio, nivel, estado, fecha_registro FROM public.alumnos")
    st.dataframe(df_all, use_container_width=True)
