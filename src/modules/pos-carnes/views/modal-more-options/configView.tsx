export function FrmMiddle() {
  const handleClick = (buttonName: string) => {
    // Placeholder - you can replace this with your own logic
    console.log(`Clicked: ${buttonName}`)
  }
  return (
    <div className="p-6 w-full flex gap-4">
      <button
        onClick={() => handleClick('Nota de cliente')}
        className="flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 p-6 rounded-lg text-gray-700 font-medium text-center"
      >
        Nota de cliente
      </button>

      <button
        onClick={() => handleClick('Reembolso')}
        className="flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 p-6 rounded-lg text-gray-700 font-medium text-center"
      >
        Reembolso
      </button>

      <button
        onClick={() => handleClick('Cancelar orden')}
        className="flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 p-6 rounded-lg text-gray-700 font-medium text-center"
      >
        Cancelar orden
      </button>
    </div>
  )
}
