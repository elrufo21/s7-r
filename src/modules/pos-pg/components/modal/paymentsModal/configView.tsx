import { frmElementsProps } from '@/shared/shared.types'
import useAppStore from '@/store/app/appStore'
import { PaymentMethodCard } from '../../Payment'
import { HiOutlineBackspace } from 'react-icons/hi'
import BaseAutocomplete from '@/shared/components/form/base/BaseAutocomplete'

export function FrmMiddle({ control, errors, setValue, watch, editConfig }: frmElementsProps) {
  const { paymentMethodsPg, frmLoading } = useAppStore()
  const handlePaymentMethodClick = () => {}
  const handleNumpadClick = (number: string) => {}
  const handleSymbolsClick = () => {}
  return (
    <>
      <div className="product-screen min-w-[1000px]">
        <div className="leftpanel">
          <div className="payment-methods-container">
            {/* <div className="paymentmethods-container mb-3 flex-grow-1"> */}
            <div className="payment-methods flex flex-col gap-2">
              {paymentMethodsPg.map((method) => (
                <PaymentMethodCard
                  key={method.payment_method_id}
                  method={method}
                  onClick={!frmLoading ? handlePaymentMethodClick : () => {}}
                  bg=""
                />
              ))}
            </div>
            {/* </div> */}
          </div>

          {/*
             <div className="order-container">
   
               <div className="flex flex-col items-center justify-center h-full">
                 <div className="text-6xl mb-4">
                   <svg
                     fill="#858585"
                     height="70px"
                     width="70px"
                     version="1.1"
                     id="Capa_1"
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 60.013 60.013"
                   >
                     <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                     <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                     <g id="SVGRepo_iconCarrier">
                       {' '}
                       <path d="M11.68,12.506l-0.832-5h-2.99c-0.447-1.72-1.999-3-3.858-3c-2.206,0-4,1.794-4,4s1.794,4,4,4c1.859,0,3.411-1.28,3.858-3 h1.294l0.5,3H9.624l0.222,1.161l0,0.003c0,0,0,0,0,0l2.559,13.374l1.044,5.462h0.001l1.342,7.015 c-2.468,0.186-4.525,2.084-4.768,4.475c-0.142,1.405,0.32,2.812,1.268,3.858c0.949,1.05,2.301,1.652,3.707,1.652h2 c0,3.309,2.691,6,6,6s6-2.691,6-6h11c0,3.309,2.691,6,6,6s6-2.691,6-6h4c0.553,0,1-0.447,1-1s-0.447-1-1-1h-4.35 c-0.826-2.327-3.043-4-5.65-4s-4.824,1.673-5.65,4h-11.7c-0.826-2.327-3.043-4-5.65-4s-4.824,1.673-5.65,4H15 c-0.842,0-1.652-0.362-2.224-0.993c-0.577-0.639-0.848-1.461-0.761-2.316c0.152-1.509,1.546-2.69,3.173-2.69h0.781 c0.02,0,0.038,0,0.06,0l6.128-0.002L33,41.501v-0.001l7.145-0.002L51,41.496v-0.001l4.024-0.001c2.751,0,4.988-2.237,4.988-4.987 V12.494L11.68,12.506z M4,10.506c-1.103,0-2-0.897-2-2s0.897-2,2-2s2,0.897,2,2S5.103,10.506,4,10.506z M46,45.506 c2.206,0,4,1.794,4,4s-1.794,4-4,4s-4-1.794-4-4S43.794,45.506,46,45.506z M23,45.506c2.206,0,4,1.794,4,4s-1.794,4-4,4 s-4-1.794-4-4S20.794,45.506,23,45.506z M58.013,21.506H51v-7.011l7.013-0.002V21.506z M42,39.498v-6.991h7v6.989L42,39.498z M42,30.506v-7h7v7H42z M24,39.503v-6.997h7v6.995L24,39.503z M24,30.506v-7h7v7H24z M13.765,23.506H22v7h-6.895L13.765,23.506z M49,21.506h-7v-7h7V21.506z M40,21.506h-7V14.5l7-0.002V21.506z M31,14.506v7h-7v-7H31z M33,23.506h7v7h-7V23.506z M51,23.506h7v7 h-7V23.506z M22,14.504v7.003h-8.618l-1.34-7L22,14.504z M15.487,32.506H22v6.997l-5.173,0.002L15.487,32.506z M33,32.506h7v6.992 L33,39.5V32.506z M55.024,39.494L51,39.495v-6.989h7.013v4C58.013,38.154,56.672,39.494,55.024,39.494z"></path>{' '}
                     </g>
                   </svg>
                 </div>
   
                 <p className="text-gray-500">Comience a agregar productos</p>
               </div>
   
             </div>
   */}

          {/* ------------------------------------------------ ini */}
          <div className="order-bottom">
            {/*
               <div className="order-summary p-3">
                 <div className="flex justify-between text-gray-500">
                   <span>Impuestos</span>
                   <span>S/ 0:00</span>
                 </div>
                 <div className="flex justify-between text-lg font-bold mt-1">
                   <span>Total</span>
                   <span>S/ 333.33</span>
                 </div>
               </div>
                */}
            {/*-------------*/}

            <div className="pads">
              <div className="control-buttons">
                <BaseAutocomplete
                  control={control}
                  errors={errors}
                  setValue={setValue}
                  editConfig={{ config: editConfig }}
                  formItem={watch()}
                  name={'partner_id'}
                  label="partner_name"
                  rulers={true}
                  filters={[]}
                  allowSearchMore={true}
                  config={{
                    modalTitle: 'Clientes',
                    primaryKey: 'partner_id',
                    fncName: 'fnc_partner',
                  }}
                  className="bg-white w-full rounded-sm p-2 mt-1 mb-1 rounded-xl"
                />
              </div>

              {/* --------------------- */}

              <div className="subpads">
                <div className="numpad">
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg"
                    onClick={() => handleNumpadClick('1')}
                  >
                    1
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg"
                    onClick={() => handleNumpadClick('2')}
                  >
                    2
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg"
                    onClick={() => handleNumpadClick('3')}
                  >
                    3
                  </button>

                  <button
                    className={`numpad-button btn2 btn2-white fs-3 lh-mlg`}
                    onClick={() => handleNumpadClick('+10')}
                  >
                    +10
                  </button>

                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg"
                    onClick={() => handleNumpadClick('4')}
                  >
                    4
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg"
                    onClick={() => handleNumpadClick('5')}
                  >
                    5
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg"
                    onClick={() => handleNumpadClick('6')}
                  >
                    6
                  </button>

                  <button
                    className={`numpad-button btn2 btn2-white fs-3 lh-mlg `}
                    onClick={() => handleNumpadClick('+20')}
                  >
                    +20
                  </button>

                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg"
                    onClick={() => handleNumpadClick('7')}
                  >
                    7
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg"
                    onClick={() => handleNumpadClick('8')}
                  >
                    8
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg"
                    onClick={() => handleNumpadClick('9')}
                  >
                    9
                  </button>

                  <button
                    className={`numpad-button btn2 btn2-white fs-3 lh-mlg`}
                    onClick={() => handleNumpadClick('+50')}
                  >
                    +50
                  </button>

                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg o_colorlist_item_numpad_color_3"
                    onClick={() => {
                      handleSymbolsClick()
                    }}
                  >
                    +/-
                  </button>

                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg"
                    onClick={() => handleNumpadClick('0')}
                  >
                    0
                  </button>

                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg o_colorlist_item_numpad_color_2"
                    onClick={() => handleNumpadClick('.')}
                  >
                    .
                  </button>

                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg justify-items-center o_colorlist_item_numpad_color_1"
                    onClick={() => handleNumpadClick('backspace')}
                  >
                    <HiOutlineBackspace style={{ fontSize: '28px' }} />
                    {/* <LiaBackspaceSolid style={{ fontSize: '30px' }} /> */}
                  </button>
                </div>

                <div className="actionpad d-flex flex-row gap-2"></div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------ fin */}
        </div>
        {/* ---------------------------------------- derecho ini */}

        {/* Panel central con resumen de pagos */}
        <div className="center-content flex flex-col flex-grow-1 gap-4 p-4">
          {/* Total a pagar */}
          <section className="paymentlines-container">
            {/* <div className="text-[100px] text-center text-[RGBA(17,34,29,1)]"> */}
            <div className="text-[100px] text-center text-[#283833]">
              {/* S/ {adjustTotal(getTotalPriceByOrder(selectedOrder)).adjusted.toFixed(2)} */}
              <span className="text-[60%] opacity-[0.7]">S/ </span>
              <span className="">0.0</span>
            </div>
          </section>

          <div className="payment-summary d-flex flex-grow-1 flex-column gap-1 overflow-y-auto py-3">
            {/* Saldo restante y cambio */}
          </div>
        </div>

        {/* ---------------------------------------- derecho fin */}
      </div>
    </>
  )
}
