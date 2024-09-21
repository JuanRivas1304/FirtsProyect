export default function Homepage() {
  return (
    <section className="h-[calc(100vh-7rem)] flex flex-col justify-center items-center bg-gray-800 px-6 py-12">
      <div className="max-w-3xl text-center bg-gray-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-white text-4xl lg:text-5xl font-extrabold mb-6">
          Bienvenido al Sistema de Reserva de Citas
        </h1>
        <p className="text-white text-lg lg:text-xl leading-relaxed mb-8">
          Facilitamos la programación, gestión y cancelación de tus citas de manera rápida y sencilla.
          Podrás seleccionar el servicio que necesitas, elegir el horario que más te convenga, y confirmar tu cita en pocos pasos.
          <br /><br />
          Regístrate o inicia sesión si ya tienes una cuenta.
        </p>
      </div>
    </section>
  )
}
