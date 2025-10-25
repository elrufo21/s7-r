import { InputWithKeyboard } from '@/shared/ui/inputs/InputWithKeyboard'
import useAppStore from '@/store/app/appStore'

export const CustomHeader = ({ fnc_create_button }: any) => {
  const { searchTerm, setSearchTerm } = useAppStore()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b gap-2 z-[1000]">
      <div className="flex items-center space-x-2">
        {fnc_create_button && (
          <button
            className="btn btn-primary btn-lg lh-lg me-2 rounded-sm"
            onClick={fnc_create_button}
          >
            <span className="font-medium">Crear</span>
          </button>
        )}
      </div>
      <div className="relative w-[20rem] pl-5 pr-5 py-2 border rounded-md bg-white text-[16px]">
        <InputWithKeyboard
          type="text"
          className=""
          placeholder="Buscar clientes ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onValueChange={(value) => setSearchTerm(value)} // Para el teclado virtual
          aria-label="Buscar clientes"
          enableVirtualKeyboard={true}
          // useNumericKeyboard={true} // Opcional
          // isInsideModal={true} // Opcional
        />
      </div>
    </div>
  )
}
