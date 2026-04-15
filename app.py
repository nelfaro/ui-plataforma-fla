import streamlit as st
import pandas as pd
import psycopg2
import plotly.express as px
import plotly.graph_objects as go
import os

# --- 1. CONFIGURACIÓN E IDENTIDAD ---
st.set_page_config(page_title="Fla Control Center", layout="wide", page_icon="💛")

# CSS Corregido para visibilidad total y diseño pro
st.markdown("""
    <style>
    /* Forzamos que los contenedores de métricas tengan fondo oscuro */
    [data-testid="stMetric"] {
        background-color: #1e1e1e; /* Fondo gris oscuro casi negro */
        padding: 15px;
        border-radius: 10px;
        border-left: 5px solid #FFD700; /* Borde amarillo lateral */
        box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
    }
    /* El número siempre amarillo brillante */
    [data-testid="stMetricValue"] {
        color: #FFD700 !important;
    }
    /* El texto de la métrica en blanco/gris para que resalte en el fondo oscuro */
    [data-testid="stMetricLabel"] {
        color: #ffffff !important;
    }
    /* Badges de la tabla */
    .badge { padding: 4px 10px; border-radius: 10px; font-weight: bold; color: black; font-size: 12px; }
    .registrado { background-color: #2ecc71; }
    .pendiente { background-color: #f1c40f; }
    .calificado { background-color: #3498db; }
    .frio { background-color: #95a5a6; }
    </style>
""", unsafe_allow_html=True)

# --- 2. FUNCIONES DE SEGURIDAD ---
if "password_correct" not in st.session_state:
    st.session_state["password_correct"] = False

def login():
    st.title("🔑 Acceso Academia Fla")
    user = st.text_input("Usuario")
    pw = st.text_input("Contraseña", type="password")
    if st.button("Entrar"):
        if user == "fla" and pw == "academia2026":
            st.session_state["password_correct"] = True
            st.rerun()
        else:
            st.error("Credenciales incorrectas")

if not st.session_state["password_correct"]:
    login()
    st.stop()

# --- 3. CONEXIÓN A DB ---
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
    # --- FIX LOGO GOOGLE DRIVE ---
    # Instrucción: Si tu link es https://drive.google.com/file/d/ABC123XYZ/view
    # El ID es lo que está entre /d/ y /view. Cámbialo abajo:
    ID_IMAGEN = "158-nhNVi6hJKryMKhdWNjJH97LI87kN3" # <--- PEGA AQUÍ EL ID DE TU IMAGEN
    url_directa = f"https://drive.google.com/uc?export=view&id={ID_IMAGEN}"
    
    st.image(url_directa, width=150)
    st.title("Fla Control Center")
    menu = st.radio("Navegación", ["📈 Dashboard", "📱 Conectar WhatsApp", "💬 Chatwoot", "📖 Carga RAG"])
    
    if st.button("🚪 Salir"):
        st.session_state["password_correct"] = False
        st.rerun()

# --- CONTENIDO ---
conn = get_connection()

if menu == "📈 Dashboard":
    st.title("Gestión de Academia de Inglés")

    # KPIs superiores - FIX KEYERROR
    try:
        df_kpis = pd.read_sql("SELECT * FROM public.v_kpis_mes LIMIT 1", conn)
        if not df_kpis.empty:
            k = df_kpis.iloc[0]
            c1, c2, c3, c4 = st.columns(4)
            # Cambiamos 'registros' por 'registrados' que es el nombre real en tu SQL
            c1.metric("Chats este mes", f"{k['leads_nuevos_mes']}")
            c2.metric("Leads calificados", f"{k['leads_calificados']}")
            c3.metric("Registros confirmados", f"{k['registrados']}", f"Conv. {k['tasa_conversion_pct']}%")
            c4.metric("Ingresos Mes", f"${k['ingresos_mes']/1000:,.1f}k")
    except Exception as e:
        st.error(f"Error cargando KPIs: {e}")

    st.divider()

    # Gráfico Semanal
    df_sem = pd.read_sql("""
        SELECT to_char(date_trunc('week', created_at), 'Sem WW') as semana, COUNT(*) as chats 
        FROM conversation_logs GROUP BY 1 ORDER BY 1
    """, conn)
    
    fig = go.Figure()
    fig.add_trace(go.Bar(x=df_sem['semana'], y=df_sem['chats'], name='Chats', marker_color='#3498db'))
    fig.update_layout(barmode='group', height=350, paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
    st.plotly_chart(fig, use_container_width=True)

    # Tabla con Estilo (Badges)
    st.subheader("Últimas consultas atendidas")
    df_rec = pd.read_sql("""
        SELECT nombre, lead_tipo as tipo, origen, intencion, estado, completitud 
        FROM alumnos ORDER BY ultimo_contacto DESC LIMIT 10
    """, conn)

    # Convertimos los estados en HTML Badges
    def apply_style(state):
        if state == 'REGISTRADO': return f'<span class="badge registrado">{state}</span>'
        if state == 'PAGO_PENDIENTE': return f'<span class="badge pendiente">{state}</span>'
        if state == 'CALIFICADO': return f'<span class="badge calificado">{state}</span>'
        return f'<span class="badge frio">{state}</span>'

    df_rec['estado'] = df_rec['estado'].apply(apply_style)
    st.write(df_rec.to_html(escape=False, index=False), unsafe_allow_html=True)

elif menu == "📱 Conectar WhatsApp":
    st.title("Conectar WhatsApp")
    st.components.v1.iframe("URL_DE_TU_PUENTE_AQUI", height=600)

conn.close()
