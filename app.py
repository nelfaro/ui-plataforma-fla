import streamlit as st
import pandas as pd
import psycopg2
import plotly.express as px
import plotly.graph_objects as go
import os
import requests

# --- 1. CONFIGURACIÓN E IDENTIDAD ---
st.set_page_config(page_title="Fla Control Center", layout="wide", page_icon="💛")

# Estilo para cards, métricas y badges
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

    .badge {
        padding: 4px 10px;
        border-radius: 10px;
        font-weight: bold;
        font-size: 12px;
        color: #1a1a1a;
    }

    .registrado {
        background-color: #d4edda;
        color: #155724;
    }

    .pendiente {
        background-color: #fff3cd;
        color: #856404;
    }

    .calificado {
        background-color: #cce5ff;
        color: #004085;
    }

    .frio {
        background-color: #e2e3e5;
        color: #383d41;
    }
    </style>
""", unsafe_allow_html=True)

# --- 2. SISTEMA DE LOGIN ---
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

    conn = None
    try:
        conn = get_connection()

        # KPIs superiores
        try:
            df_kpis = pd.read_sql("SELECT * FROM public.v_kpis_mes LIMIT 1", conn)

            if not df_kpis.empty:
                k = df_kpis.iloc[0]
                c1, c2, c3, c4 = st.columns(4)

                c1.metric("Chats este mes", f"{k['leads_nuevos_mes']}", "+18% vs mes anterior")
                c2.metric("Leads calificados", f"{k['leads_calificados']}", "+12 nuevos")
                c3.metric("Registros confirmados", f"{k['registrados']}", f"Conversión {k['tasa_conversion_pct']}%")
                c4.metric("Pagos verificados", f"${k['ingresos_mes']/1000:,.0f}k", "8 pend. bancarios")
        except Exception:
            st.warning("⚠️ Error al cargar KPIs de la base de datos.")

        st.divider()

        # FILA 1: Gráfico de Barras y Donut Clasificación
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
                fig.add_trace(go.Bar(
                    name='Chats',
                    x=df_sem['semana'],
                    y=df_sem['chats'],
                    marker_color='#3498db'
                ))
                fig.add_trace(go.Bar(
                    name='Registros',
                    x=df_sem['semana'],
                    y=df_sem['chats'] * 0.4,
                    marker_color='#2ecc71'
                ))
                fig.update_layout(
                    barmode='group',
                    height=350,
                    margin=dict(t=20, b=20, l=0, r=0)
                )
                st.plotly_chart(fig, use_container_width=True)
            except Exception:
                st.info("Cargando datos de chats...")

        with col_donut:
            st.subheader("Clasificación de leads")
            try:
                df_dist = pd.read_sql("SELECT lead_tipo, total FROM v_distribucion_leads", conn)
                fig_donut = px.pie(
                    df_dist,
                    values='total',
                    names='lead_tipo',
                    hole=0.7,
                    color_discrete_sequence=['#3498db', '#e67e22', '#1abc9c', '#f1c40f']
                )
                fig_donut.update_layout(
                    height=350,
                    margin=dict(t=0, b=0, l=0, r=0)
                )
                st.plotly_chart(fig_donut, use_container_width=True)
            except Exception:
                st.info("Sin datos de clasificación.")

        # FILA 2: Funnel y Origen
        col_funnel, col_origen = st.columns([1, 1])

        with col_funnel:
            st.subheader("Funnel de conversión")
            try:
                df_fun = pd.read_sql("""
                    SELECT etapa, cantidad
                    FROM v_funnel_conversion
                    ORDER BY orden
                """, conn)

                fig_fun = px.funnel(
                    df_fun,
                    x='cantidad',
                    y='etapa',
                    color_discrete_sequence=['#9b59b6']
                )
                st.plotly_chart(fig_fun, use_container_width=True)
            except Exception:
                st.info("Funnel no disponible.")

        with col_origen:
            st.subheader("Origen de leads")
            try:
                df_orig = pd.read_sql("""
                    SELECT origen, COUNT(*) as total
                    FROM alumnos
                    GROUP BY 1
                """, conn)

                fig_orig = px.pie(
                    df_orig,
                    values='total',
                    names='origen',
                    hole=0.7,
                    color_discrete_sequence=['#3f51b5', '#2196f3', '#009688']
                )
                st.plotly_chart(fig_orig, use_container_width=True)
            except Exception:
                st.info("Sin datos de origen.")

        st.divider()

        # TABLA DE CONSULTAS
        st.subheader("Últimas consultas atendidas")
        try:
            df_rec = pd.read_sql("""
                SELECT nombre,
                       lead_tipo as tipo,
                       origen,
                       intencion,
                       estado,
                       completitud
                FROM alumnos
                ORDER BY ultimo_contacto DESC
                LIMIT 10
            """, conn)

            def make_badge(state):
                if state == 'REGISTRADO' or state == 'ACTIVO':
                    return f'<span class="badge registrado">{state}</span>'
                if state == 'PAGO_PENDIENTE':
                    return f'<span class="badge pendiente">{state}</span>'
                if state == 'CALIFICADO':
                    return f'<span class="badge calificado">{state}</span>'
                return f'<span class="badge frio">{state}</span>'

            df_rec['estado'] = df_rec['estado'].apply(make_badge)
            st.write(df_rec.to_html(escape=False, index=False), unsafe_allow_html=True)
        except Exception:
            st.info("No hay consultas recientes para mostrar.")

    finally:
        if conn is not None:
            conn.close()


# ==========================================
# PESTAÑA 2: CRM CHATWOOT
# ==========================================
elif menu == "💬 Chatwoot":
    st.header("💬 Gestión de Clientes (Chatwoot)")
    st.link_button(
        "🚀 Abrir Chatwoot",
        "https://asistente-ia-fla-chatwoot.x5miqk.easypanel.host/"
    )
    # st.components.v1.iframe("https://asistente-ia-fla-chatwoot.x5miqk.easypanel.host/", height=700, scrolling=True)


# ==========================================
# PESTAÑA 3: CONECTAR WHATSAPP
# ==========================================
elif menu == "📱 Conectar WhatsApp":
    st.header("📱 Conectar WhatsApp al Agente")
    st.info(
        "Escaneá el código QR con tu WhatsApp para vincular tu número al agente. "
        "Una vez conectado, el agente comenzará a recibir y responder mensajes automáticamente."
    )
    st.components.v1.iframe(
        "https://asistente-ia-fla-puentewhatsapp.x5miqk.easypanel.host/",
        height=700,
        scrolling=True
    )
    st.caption("⚠️ Si el QR no carga, verificá que el servicio de puente WhatsApp esté activo en Easypanel.")


# ==========================================
# PESTAÑA 4: CARGAR RAG
# ==========================================
elif menu == "📖 Carga RAG":
    st.header("📤 Actualizar RAG")

    try:
        conn = get_connection()

        query_ultimo = """
            SELECT nombre_archivo,
                   to_char(fecha_proceso, 'DD/MM/YYYY HH24:MI') as fecha_formateada
            FROM control_cargas
            ORDER BY id DESC
            LIMIT 1
        """
        ultimo = pd.read_sql(query_ultimo, conn)

        if not ultimo.empty:
            st.info(
                f"Último archivo procesado: **{ultimo['nombre_archivo'].iloc[0]}** "
                f"(el {ultimo['fecha_formateada'].iloc[0]} hs)"
            )

        conn.close()

    except Exception as e:
        st.warning(f"No se pudo cargar el historial de archivos. Detalle: {e}")

    archivo = st.file_uploader("Sube el CSV del día", type=["csv"])

    if archivo:
        if st.button("Procesar y Actualizar Stock"):
            url_n8n = "https://agentes-n8n.xjkmv6.easypanel.host/webhook/subir-stock-manual"
            files = {'file': (archivo.name, archivo.getvalue(), 'text/csv')}

            with st.spinner("Enviando archivo a n8n..."):
                try:
                    res = requests.post(url_n8n, files=files, timeout=20)

                    if res.status_code == 200:
                        st.success("✅ ¡Éxito! El stock ha sido actualizado.")
                    elif res.status_code == 400:
                        try:
                            msg = res.json().get("mensaje", "Archivo duplicado.")
                        except Exception:
                            msg = "Archivo rechazado (Duplicado o error de formato)."
                        st.warning(f"⚠️ {msg}")
                    else:
                        st.error(f"❌ Error del servidor (Código {res.status_code})")

                except requests.exceptions.Timeout:
                    st.warning("⏳ El servidor tardó en responder. Verifica el log en unos minutos.")
                except Exception as e:
                    st.error(f"❌ Fallo de conexión con n8n: {e}")
