import streamlit as st
import pandas as pd
import psycopg2
import plotly.express as px
import plotly.graph_objects as go
import os
import requests

# --- 1. CONFIGURACIÓN E IDENTIDAD ---
st.set_page_config(page_title="Fla Control Center", layout="wide", page_icon="💛")

st.markdown("""
<style>
[data-testid="stMetric"] {
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #efefef;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.05);
}
[data-testid="stMetricValue"] {
    color: #D4AF37 !important;
}
.badge { padding: 4px 10px; border-radius: 10px; font-weight: bold; font-size: 12px; color: #1a1a1a; }
.registrado { background-color: #d4edda; color: #155724; }
.pendiente { background-color: #fff3cd; color: #856404; }
.calificado { background-color: #cce5ff; color: #004085; }
.frio { background-color: #e2e3e5; color: #383d41; }
</style>
""", unsafe_allow_html=True)

# --- LOGIN ---
if "authenticated" not in st.session_state:
    st.session_state["authenticated"] = False


def login_screen():
    st.markdown("<h2 style='text-align: center;'>🔑 Acceso Academia Fla</h2>", unsafe_allow_html=True)
    col1, col2, col3 = st.columns([1, 2, 1])

    with col2:
        with st.form("login_form"):
            user = st.text_input("Usuario")
            pwd = st.text_input("Contraseña", type="password")
            submit = st.form_submit_button("Entrar")

            if submit:
                if user.lower() == "fla" and pwd == "academia2026":
                    st.session_state["authenticated"] = True
                    st.rerun()
                else:
                    st.error("Credenciales incorrectas")


if not st.session_state["authenticated"]:
    login_screen()
    st.stop()

# --- DB ---
def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME", "db_agente"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASS"),
        port=os.getenv("DB_PORT", "5432")
    )

# --- SIDEBAR ---
with st.sidebar:
    ID_IMAGEN = "158-nhNVi6hJKryMKhdWNjJH97LI87kN3"
    url_directa = f"https://drive.google.com/uc?id={ID_IMAGEN}"

    st.image(url_directa, width=180)
    st.title("Fla Control Center")
    st.divider()

    menu = st.radio(
        "Navegación",
        ["📈 Dashboard", "📱 Conectar WhatsApp", "💬 Chatwoot", "📖 Carga RAG"]
    )

    st.divider()

    if st.button("🚪 Cerrar Sesión"):
        st.session_state["authenticated"] = False
        st.rerun()

# ==========================================
# PESTAÑA 1: DASHBOARD
# ==========================================
if menu == "📈 Dashboard":
    st.title("Gestión de Academia de Inglés")
    conn = get_connection()

    try:
        df_kpis = pd.read_sql("SELECT * FROM public.v_kpis_mes LIMIT 1", conn)

        if not df_kpis.empty:
            k = df_kpis.iloc[0]
            c1, c2, c3, c4 = st.columns(4)

            c1.metric("Chats este mes", f"{k['leads_nuevos_mes']}", "+18% vs mes anterior")
            c2.metric("Leads calificados", f"{k['leads_calificados']}", "+12 nuevos")
            c3.metric("Registros confirmados", f"{k['registrados']}", f"Conversión {k['tasa_conversion_pct']}%")
            c4.metric("Pagos verificados", f"${k['ingresos_mes']/1000:,.0f}k", "8 pend. bancarios")

    except:
        st.warning("⚠️ Error al cargar KPIs.")

    st.divider()

    col_bar, col_donut = st.columns([2, 1])

    with col_bar:
        st.subheader("Chats y conversiones por semana")

        try:
            df_sem = pd.read_sql("""
                SELECT to_char(date_trunc('week', created_at), 'Sem WW') as semana,
                       COUNT(*) as chats
                FROM conversation_logs
                GROUP BY 1
                ORDER BY 1
            """, conn)

            fig = go.Figure()
            fig.add_trace(go.Bar(name='Chats', x=df_sem['semana'], y=df_sem['chats']))
            fig.add_trace(go.Bar(name='Registros', x=df_sem['semana'], y=df_sem['chats'] * 0.4))
            fig.update_layout(barmode='group')

            st.plotly_chart(fig, use_container_width=True)

        except:
            st.info("Cargando datos...")

    with col_donut:
        st.subheader("Clasificación de leads")

        try:
            df_dist = pd.read_sql("SELECT lead_tipo, total FROM v_distribucion_leads", conn)
            fig_donut = px.pie(df_dist, values='total', names='lead_tipo', hole=0.7)
            st.plotly_chart(fig_donut, use_container_width=True)

        except:
            st.info("Sin datos")

    conn.close()

# ==========================================
# CHATWOOT
# ==========================================
elif menu == "💬 Chatwoot":
    st.header("💬 Gestión de Clientes")
    st.link_button(
        "Abrir Chatwoot",
        "https://agentes-chatwoot.xjkmv6.easypanel.host/"
    )

# ==========================================
# WHATSAPP
# ==========================================
elif menu == "📱 Conectar WhatsApp":
    st.header("📱 Conectar WhatsApp")
    st.components.v1.iframe(
        "https://asistente-ia-fla-puentewhatsapp.x5miqk.easypanel.host/",
        height=700
    )

# ==========================================
# RAG
# ==========================================
elif menu == "📖 Carga RAG":
    st.header("📤 Actualizar RAG")

    try:
        conn = get_connection()

        query = """
            SELECT nombre_archivo,
                   to_char(fecha_proceso, 'DD/MM/YYYY HH24:MI') as fecha_formateada
            FROM control_cargas
            ORDER BY id DESC
            LIMIT 1
        """

        ultimo = pd.read_sql(query, conn)

        if not ultimo.empty:
            st.info(
                f"Último archivo: {ultimo['nombre_archivo'].iloc[0]} "
                f"({ultimo['fecha_formateada'].iloc[0]})"
            )

        conn.close()

    except Exception as e:
        st.warning(f"Error: {e}")

    archivo = st.file_uploader("Sube CSV", type=["csv"])

    if archivo:
        if st.button("Procesar"):
            url_n8n = "https://agentes-n8n.xjkmv6.easypanel.host/webhook/subir-stock-manual"

            files = {'file': (archivo.name, archivo.getvalue(), 'text/csv')}

            try:
                res = requests.post(url_n8n, files=files, timeout=20)

                if res.status_code == 200:
                    st.success("✅ OK")
                else:
                    st.error("❌ Error servidor")

            except Exception as e:
                st.error(f"Error conexión: {e}")
