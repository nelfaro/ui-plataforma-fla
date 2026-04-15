import streamlit as st
import pandas as pd
import psycopg2
import plotly.express as px
import plotly.graph_objects as go
import os
from datetime import datetime

# --- CONFIGURACIÓN DE PÁGINA ---
st.set_page_config(page_title="Dashboard Academia Fla", layout="wide", page_icon="📈")

# Estilo CSS para imitar las "Cards" de la imagen
st.markdown("""
    <style>
    .metric-card {
        background-color: #f8f9fa;
        border-radius: 10px;
        padding: 20px;
        border: 1px solid #ececf1;
    }
    .status-badge {
        padding: 2px 8px;
        border-radius: 15px;
        font-size: 12px;
        font-weight: bold;
    }
    </style>
""", unsafe_allow_html=True)

# --- CONEXIÓN ---
def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        port=os.getenv("DB_PORT", "5432")
    )

conn = get_connection()

# --- HEADER / KPIs ---
st.title("Gestión de Academia de Inglés con Fla")

# Usando la vista v_kpis_mes (asumiendo que tiene estas columnas)
df_kpis = pd.read_sql("SELECT * FROM v_kpis_mes", conn)

col1, col2, col3, col4 = st.columns(4)
with col1:
    st.metric("Chats este mes", f"{df_kpis['chats_total'][0]}", "+18% vs mes anterior")
with col2:
    st.metric("Leads calificados", f"{df_kpis['leads_calificados'][0]}", "+12 nuevos")
with col3:
    st.metric("Registros confirmados", f"{df_kpis['registros'][0]}", "Conversión 55%")
with col4:
    st.metric("Pagos verificados", f"${df_kpis['pagos_suma'][0]}k", "8 pend. bancarios")

st.markdown("---")

# --- FILA CENTRAL: GRÁFICO SEMANAL Y CLASIFICACIÓN ---
col_left, col_right = st.columns([2, 1])

with col_left:
    st.subheader("Chats y conversiones por semana")
    # Simulación de datos semanales (podrías crear una vista v_semanal)
    df_semanal = pd.read_sql("""
        SELECT week as "Semana", chats, registros, pagos 
        FROM (SELECT 'Sem 1' as week, 28 as chats, 8 as registros, 6 as pagos
              UNION SELECT 'Sem 2', 35, 12, 10
              UNION SELECT 'Sem 3', 32, 5, 4
              UNION SELECT 'Sem 4', 29, 6, 4
              UNION SELECT 'Sem 5', 21, 2, 2) as t
    """, conn)
    
    fig_bar = go.Figure(data=[
        go.Bar(name='Chats', x=df_semanal['Semana'], y=df_semanal['chats'], marker_color='#3498db'),
        go.Bar(name='Registros', x=df_semanal['Semana'], y=df_semanal['registros'], marker_color='#2ecc71'),
        go.Bar(name='Pagos ok', x=df_semanal['Semana'], y=df_semanal['pagos'], marker_color='#f1c40f')
    ])
    fig_bar.update_layout(bgroupmode='group', height=350, margin=dict(l=20, r=20, t=20, b=20))
    st.plotly_chart(fig_bar, use_container_width=True)

with col_right:
    st.subheader("Clasificación de leads")
    df_dist = pd.read_sql("SELECT lead_tipo, cantidad FROM v_distribucion_leads", conn)
    fig_donut = px.pie(df_dist, values='cantidad', names='lead_tipo', hole=0.7,
                       color_discrete_sequence=['#3498db', '#e67e22', '#1abc9c', '#f1c40f'])
    fig_donut.update_layout(showlegend=True, height=350, margin=dict(l=20, r=20, t=20, b=20))
    st.plotly_chart(fig_donut, use_container_width=True)

# --- FILA INFERIOR: FUNNEL Y ORIGEN ---
col_funnel, col_origen = st.columns([1.5, 1])

with col_funnel:
    st.subheader("Funnel de conversión")
    df_funnel = pd.read_sql("SELECT etapa, cantidad FROM v_funnel_conversion", conn)
    fig_funnel = px.funnel(df_funnel, y='etapa', x='cantidad', color_discrete_sequence=['#9b59b6'])
    fig_funnel.update_layout(height=300)
    st.plotly_chart(fig_funnel, use_container_width=True)

with col_origen:
    st.subheader("Origen de leads")
    # Asumiendo que esta info está en alumnos
    df_origen = pd.read_sql("SELECT origen, COUNT(*) as cantidad FROM alumnos GROUP BY origen", conn)
    fig_origen = px.pie(df_origen, values='cantidad', names='origen', hole=0.7,
                        color_discrete_sequence=['#3f51b5', '#2196f3', '#009688'])
    fig_origen.update_layout(height=300)
    st.plotly_chart(fig_origen, use_container_width=True)

# --- TABLA DE ÚLTIMAS CONSULTAS ---
st.subheader("Últimas consultas atendidas")

# Unimos alumnos con sus últimos logs
query_tabla = """
    SELECT 
        nombre as "Nombre", 
        lead_tipo as "Tipo", 
        origen as "Origen", 
        intencion as "Intención", 
        estado as "Estado", 
        completitud as "Completitud"
    FROM alumnos
    ORDER BY ultimo_contacto DESC
    LIMIT 10
"""
df_tabla = pd.read_sql(query_tabla, conn)

# Formateo de la tabla para que se vea como en la imagen
def format_status(val):
    if val == 'Registrado': return '🟢 Registrado'
    if val == 'Pendiente pago': return '🟡 Pendiente'
    if val == 'Calificado': return '🔵 Calificado'
    return val

df_tabla['Estado'] = df_tabla['Estado'].apply(format_status)
st.dataframe(df_tabla, use_container_width=True, hide_index=True)

conn.close()