interface ColorSquareProps {
  color: string
  options?: any[]
  value?: string
  code?: string
}

export const ColorSquare = ({
  color,
  options = [],
  value = 'value',
  code = 'label',
}: ColorSquareProps) => {
  const colorOptions = options
  const selectedColor = colorOptions
    ? colorOptions.find((item) => item?.[value] === Number(color))
    : null
  //console.log(options, value, color)

  return (
    <div className="o_colorlist  flex-wrap  mw-100 gap-2">
      <button
        type="button"
        className={`btn p-0 mr-1 rounded-0 o_colorlist_toggler ${
          options.length ? ` bg-[#${selectedColor?.[code]}] ` : ` o_colorlist_item_color_${color}`
        }`}
      ></button>
    </div>
  )
}
