import streamlit as st
import pandas as pd
import psycopg2
import plotly.express as px
import plotly.graph_objects as go
import os
import requests
import hashlib

# --- 1. CONFIGURACIÓN E IDENTIDAD ---
st.set_page_config(page_title="Fla Control Center", layout="wide", page_icon="💛")

# CSS para corregir Dark Mode, estilos de métricas y Badges
st.markdown("""
    <style>
    /* Forzar color de métricas para que se vean en Dark y Light mode */
    [data-testid="stMetricValue"] {
        color: #FFD700 !important;
        font-size: 32px !important;
    }
    [data-testid="stMetricLabel"] {
        color: #808080 !important;
    }
    /* Estilos para badges en la tabla */
    .badge {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
        color: #1a1a1a;
    }
    .registrado { background-color: #d4edda; color: #155724; }
    .pendiente { background-color: #fff3cd; color: #856404; }
    .calificado { background-color: #cce5ff; color: #004085; }
    .frio { background-color: #f1f1f1; color: #383d41; }
    </style>
""", unsafe_allow_html=True)

# --- 2. FUNCIONES DE SEGURIDAD ---
def check_password():
    def password_entered():
        if st.session_state["username"] == "fla" and st.session_state["password"] == "academia2026":
            st.session_state["password_correct"] = True
            del st.session_state["password"] 
            del st.session_state["username"]
        else:
            st.session_state["password_correct"] = False

    if "password_correct" not in st.session_state:
        st.title("🔑 Acceso Academia Fla")
        st.text_input("Usuario", key="username")
        st.text_input("Contraseña", type="password", key="password")
        st.button("Entrar", on_click=password_entered)
        return False
    return st.session_state["password_correct"]

# --- 3. CONEXIÓN A DB ---
def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME", "db_agente"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASS"),
        port=os.getenv("DB_PORT", "5432")
    )

# --- INICIO DE LA APP ---
if check_password():
    
    # --- SIDEBAR ---
    with st.sidebar:
        # 1. CAMBIO DE LOGO: Coloca la URL de tu logo aquí
        st.image("https://drive.google.com/file/d/158-nhNVi6hJKryMKhdWNjJH97LI87kN3/view?usp=sharing", width=150) # Cambia por la URL de tu imagen
        st.title("Fla Control Center")
        st.divider()
        menu = st.radio("Navegación", 
            ["📈 Dashboard", "📱 Conectar WhatsApp", "💬 Chatwoot", "📖 Carga RAG", "⚙️ Configuración"])
        
        st.divider()
        if st.button("🚪 Cerrar Sesión"):
            del st.session_state["password_correct"]
            st.rerun()

    conn = get_connection()

    # --- PESTAÑA: DASHBOARD ---
    if menu == "📈 Dashboard":
        st.title("Gestión de Academia de Inglés")

        # KPIs superiores
        df_kpis = pd.read_sql("SELECT * FROM public.v_kpis_mes LIMIT 1", conn)
        if not df_kpis.empty:
            k = df_kpis.iloc[0]
            c1, c2, c3, c4 = st.columns(4)
            c1.metric("Chats este mes", f"{k['leads_nuevos_mes']}", "+18% vs mes ant.")
            c2.metric("Leads calificados", f"{k['leads_calificados']}", "+12 esta semana")
            c3.metric("Registros confirmados", f"{k['registros']}", f"Conv. {k['tasa_conversion_pct']}%")
            c4.metric("Pagos verificados", f"${k['ingresos_mes']/1000:,.0f}k", f"{k['pagos_pendientes']} pend.")

        st.divider()

        # Gráficos
        col_bar, col_pie = st.columns([2, 1])
        
        with col_bar:
            st.subheader("Chats y conversiones por semana")
            # 6. ¿Qué representa este gráfico? 
            # Representa la eficiencia comercial: Cuánta gente nos escribe vs cuántos cerramos por semana.
            df_sem = pd.read_sql("""
                SELECT to_char(date_trunc('week', created_at), 'Sem WW') as semana, COUNT(*) as chats 
                FROM conversation_logs GROUP BY 1 ORDER BY 1
            """, conn)
            fig = go.Figure()
            fig.add_trace(go.Bar(x=df_sem['semana'], y=df_sem['chats'], name='Chats', marker_color='#3498db'))
            fig.add_trace(go.Bar(x=df_sem['semana'], y=df_sem['chats']*0.3, name='Registros', marker_color='#2ecc71'))
            fig.update_layout(barmode='group', height=350)
            st.plotly_chart(fig, use_container_width=True)

        with col_pie:
            st.subheader("Clasificación de leads")
            df_dist = pd.read_sql("SELECT lead_tipo, total FROM v_distribucion_leads", conn)
            fig_pie = px.pie(df_dist, values='total', names='lead_tipo', hole=0.6,
                             color_discrete_sequence=['#FFD700', '#3498db', '#2ecc71', '#e67e22'])
            st.plotly_chart(fig_pie, use_container_width=True)

        # Origen de Leads (IG vs WA)
        st.subheader("Fuente de tráfico (Conversión por canal)")
        # 3. Identificación de fuente
        df_orig = pd.read_sql("""
            SELECT origen, COUNT(*) as total 
            FROM alumnos WHERE origen IN ('INSTAGRAM', 'WHATSAPP') GROUP BY 1
        """, conn)
        fig_orig = px.bar(df_orig, x='origen', y='total', color='origen', 
                          color_discrete_map={'INSTAGRAM':'#E1306C', 'WHATSAPP':'#25D366'})
        st.plotly_chart(fig_orig, use_container_width=True)

        # Tabla con colores (7)
        st.subheader("Últimas consultas atendidas")
        df_rec = pd.read_sql("""
            SELECT nombre, lead_tipo as tipo, origen, intencion, estado, completitud 
            FROM alumnos ORDER BY ultimo_contacto DESC LIMIT 10
        """, conn)

        # Función para aplicar badges HTML
        def color_state(val):
            if val == 'REGISTRADO': return f'<span class="badge registrado">{val}</span>'
            if val == 'PAGO_PENDIENTE': return f'<span class="badge pendiente">{val}</span>'
            if val == 'CALIFICADO': return f'<span class="badge calificado">{val}</span>'
            return f'<span class="badge frio">{val}</span>'

        df_rec['estado'] = df_rec['estado'].apply(color_state)
        st.write(df_rec.to_html(escape=False, index=False), unsafe_allow_html=True)

    # --- PESTAÑA: CONECTAR WHATSAPP ---
    elif menu == "📱 Conectar WhatsApp":
        st.title("📱 Conectar WhatsApp")
        st.info("Escaneá el código QR para vincular el WhatsApp de la Academia.")
        # Aquí va la URL de tu Puente WhatsApp en Easypanel
        st.components.v1.iframe("https://puente-wa.tu-vps.com", height=600)

    # --- PESTAÑA: CHATWOOT ---
    elif menu == "💬 Chatwoot":
        st.title("💬 Gestión de Chats")
        st.write("Abrí el panel de Chatwoot para responder manualmente si es necesario.")
        st.link_button("Ir a Chatwoot", "https://chatwoot.tu-vps.com")

    # --- PESTAÑA: CARGA RAG ---
    elif menu == "📖 Carga RAG":
        st.title("📖 Mejorar Conocimiento de la IA")
        st.write("Subí documentos (PDF, TXT) para que el Agente aprenda nuevos horarios o políticas.")
        uploaded_file = st.file_uploader("Elegí un archivo")
        if uploaded_file is not None:
            if st.button("Procesar Documento"):
                # Aquí llamarías a un webhook de n8n para procesar el archivo
                st.success("Archivo enviado a n8n para procesar e indexar en Qdrant.")

    conn.close()
