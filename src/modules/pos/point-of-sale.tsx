import { FaBarcode, FaInfo, FaPlusCircle } from 'react-icons/fa'
import { IoMdMenu } from 'react-icons/io'
import { IoSearch } from 'react-icons/io5'
//import '../../pos.css'
import { useEffect, useState } from 'react'
import '@/pos-styles.css'
const PointOfSale = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const paneClasses =
    windowWidth <= 991
      ? 'leftpane d-flex flex-column pb-2 border-end bg-view flex-grow-1 w-100 mw-100 d-none'
      : 'leftpane d-flex flex-column pb-2 border-end bg-view'

  return (
    <div className="pos">
      <div className="pos dvh-100 d-flex flex-column">
        <div className="pos-topheader position-relative d-flex align-items-center justify-content-between gap-1 p-2 m-0 bg-view border-bottom">
          <div className="pos-leftheader d-flex align-items-center flex-grow-1 overflow-auto mw-100">
            <div className="d-flex flex-shrink-0 align-items-center gap-1 position-relative pe-2 w-100">
              <div className="navbar-menu d-flex">
                <button className="register-label btn btn-lg btn-light lh-lg active">
                  <span>Registrar</span>
                </button>
                <button className="orders-button btn btn-lg btn-light lh-lg">
                  <span>Órdenes</span>
                </button>
              </div>
              <div className="navbar-separator"></div>
              <div className="d-flex flex-grow-1 h-50 overflow-hidden">
                <button className="list-plus-btn btn btn-secondary btn-lg me-1 my-2">
                  <FaPlusCircle className="cursor-pointer fa fa-fw fa-plus-circle" />
                </button>
                <div className="overflow-hidden w-100 position-relative py-2">
                  <div className="list-container-items d-flex w-100">
                    <div className="">
                      <div className="floating-order-container position-relative">
                        <button
                          className="btn btn-lg btn-secondary text-truncate mx-1 border-transparent active o_colorlist_item_color_transparent_undefined" /*style="min-width: 4rem;"*/
                        >
                          008
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pos-rightheader flex-grow-1">
            <div className="status-buttons d-flex flex-grow-1 align-items-center justify-content-end gap-1">
              <div className="w-100 w-xl-50 me-0 me-lg-2 d-flex">
                <div className="input-group">
                  <div className="form-control form-control-lg input-container d-flex align-items-center bg-view">
                    <IoSearch className="fa fa-search fa-lg fa-fw undefined" size={18} />
                    {/* <input className="o_input border-0 mx-2 text-body" type="text" style="min-width: 60px;" placeholder="Buscar productos..."> */}
                    <input
                      type="text"
                      className="o_input border-0 mx-2 text-body"
                      style={{ minWidth: '60px' }}
                      placeholder="Buscar productos ..."
                    />
                    <i className="fa fa-times mx-2 invisible"></i>
                  </div>
                </div>
              </div>
              <button className="btn btn-light btn-lg lh-lg">
                <FaBarcode size={40} className="fa fa-fw fa-lg fa-barcode" />
              </button>
              <button className="cashier-name btn btn-light btn-lg lh-lg d-flex align-items-center gap-2 flex-shrink-0 h-100 not-clickable pe-none">
                {/* <img className="avatar rounded-3" src="/web/image/res.users/2/avatar_128"> */}
                <img src="/images/Avatar.svg" alt="" className="avatar rounded-3" />
              </button>
              <button
                className="btn btn-light btn-lg lh-lg o-dropdown dropdown-toggle dropdown"
                aria-expanded="false"
              >
                <IoMdMenu size={40} className="fa fa-fw fa-bars" />
              </button>
            </div>
          </div>
        </div>
        <div className="pos-content flex-grow-1 overflow-auto bg-100">
          <div className="product-screen d-flex h-100">
            <div className={paneClasses}>
              <div className="d-flex flex-column flex-grow-1 overflow-hidden">
                <div className="order-container d-flex flex-column flex-grow-1 overflow-y-auto text-start">
                  <li className="orderline position-relative d-flex align-items-center lh-sm cursor-pointer">
                    <div className="product-order"></div>
                    <div className="d-flex flex-column w-100 p-2">
                      <div className="line-details d-flex justify-content-between align-items-center">
                        <div className="product-name d-flex flex-grow-1 align-items-center pe-2 text-truncate">
                          <span className="qty d-inline-block px-1 fw-bolder">1</span>
                          <span className="text-wrap d-inline">
                            Black embroidered t-shirt <br />
                            <small className="attribute-line fst-italic"> - S</small>
                          </span>
                        </div>
                        <div className="product-price price fw-bolder">S/&nbsp;29,50</div>
                      </div>
                      <ul className="info-list d-flex flex-column mb-0"></ul>
                    </div>
                  </li>
                  <li className="orderline position-relative d-flex align-items-center lh-sm cursor-pointer selected">
                    <div className="product-order"></div>
                    <div className="d-flex flex-column w-100 p-2">
                      <div className="line-details d-flex justify-content-between align-items-center">
                        <div className="product-name d-flex flex-grow-1 align-items-center pe-2 text-truncate">
                          <span className="qty d-inline-block px-1 fw-bolder">1</span>
                          <span className="text-wrap d-inline">
                            Casual T-shirt <br />
                            <small className="attribute-line fst-italic"> - Black, S</small>
                          </span>
                        </div>
                        <div className="product-price price fw-bolder">S/&nbsp;23,60</div>
                      </div>
                      <ul className="info-list d-flex flex-column mb-0"></ul>
                    </div>
                  </li>
                  <li className="orderline position-relative d-flex align-items-center lh-sm cursor-pointer">
                    <div className="product-order"></div>
                    <div className="d-flex flex-column w-100 p-2">
                      <div className="line-details d-flex justify-content-between align-items-center">
                        <div className="product-name d-flex flex-grow-1 align-items-center pe-2 text-truncate">
                          <span className="qty d-inline-block px-1 fw-bolder">1</span>
                          <span className="text-wrap d-inline">
                            Classic Brown Jacket <br />
                          </span>
                        </div>
                        <div className="product-price price fw-bolder">S/&nbsp;59,00</div>
                      </div>
                      <ul className="info-list d-flex flex-column mb-0"></ul>
                    </div>
                  </li>
                  <li className="orderline position-relative d-flex align-items-center lh-sm cursor-pointer">
                    <div className="product-order"></div>
                    <div className="d-flex flex-column w-100 p-2">
                      <div className="line-details d-flex justify-content-between align-items-center">
                        <div className="product-name d-flex flex-grow-1 align-items-center pe-2 text-truncate">
                          <span className="qty d-inline-block px-1 fw-bolder">1</span>
                          <span className="text-wrap d-inline">
                            T shirt slim <br />
                            <small className="attribute-line fst-italic"> - S</small>
                          </span>
                        </div>
                        <div className="product-price price fw-bolder">S/&nbsp;17,70</div>
                      </div>
                      <ul className="info-list d-flex flex-column mb-0"></ul>
                    </div>
                  </li>
                </div>
                <div className="order-summary d-flex flex-column gap-1 p-2 border-bottom fw-bolder lh-sm">
                  <div className="tax-info subentry d-flex justify-content-between w-100 fs-6 text-muted ">
                    {' '}
                    Impuestos{' '}
                    <div id="order-widget-taxes">
                      <span className="tax">S/&nbsp;19,80</span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between w-100 fs-3">
                    {' '}
                    Total <span className="total">S/&nbsp;129,80</span>
                  </div>
                </div>
              </div>
              <div className="pads px-2">
                <div className="control-buttons d-flex justify-content-between gap-2 w-100 py-2">
                  <button className="set-partner btn btn-secondary btn-lg lh-lg text-truncate w-auto">
                    <div className="text-truncate text-action">Consumidor Final</div>
                  </button>
                  <button className="btn btn-secondary btn-lg lh-lg flex-shrink-0">
                    <span>Nota</span>
                  </button>
                  <button className="btn btn-secondary btn-lg flex-shrink-0 ms-auto more-btn">
                    <i className="fa fa-fw fa-ellipsis-v" aria-hidden="true"></i>
                  </button>
                </div>
                <div className="subpads d-flex flex-column gap-2">
                  <div className="d-grid numpad numpad-4-cols">
                    <button
                      className="numpad-button position-relative btn btn-secondary btn-lg fs-3 lh-lg rounded-0 border-0 py-2"
                      value="1"
                    >
                      1
                    </button>
                    <button
                      className="numpad-button position-relative btn btn-secondary btn-lg fs-3 lh-lg rounded-0 border-0 py-2"
                      value="2"
                    >
                      2
                    </button>
                    <button
                      className="numpad-button position-relative btn btn-secondary btn-lg fs-3 lh-lg rounded-0 border-0 py-2"
                      value="3"
                    >
                      3
                    </button>
                    <button
                      className="numpad-button position-relative btn btn-secondary btn-lg fs-3 lh-lg rounded-0 border-0 py-2 active numpad-qty"
                      value="Cant."
                    >
                      Cant.
                    </button>
                    <button
                      className="numpad-button position-relative btn btn-secondary btn-lg fs-3 lh-lg rounded-0 border-0 py-2"
                      value="4"
                    >
                      4
                    </button>
                    <button
                      className="numpad-button position-relative btn btn-secondary btn-lg fs-3 lh-lg rounded-0 border-0 py-2"
                      value="5"
                    >
                      5
                    </button>
                    <button
                      className="numpad-button position-relative btn btn-secondary btn-lg fs-3 lh-lg rounded-0 border-0 py-2"
                      value="6"
                    >
                      6
                    </button>
                    <button
                      className="numpad-button position-relative btn btn-secondary btn-lg fs-3 lh-lg rounded-0 border-0 py-2 numpad-discount"
                      value="%"
                    >
                      %
                    </button>
                    <button
                      className="numpad-button position-relative btn btn-secondary btn-lg fs-3 lh-lg rounded-0 border-0 py-2"
                      value="7"
                    >
                      7
                    </button>
                    <button
                      className="numpad-button position-relative btn btn-secondary btn-lg fs-3 lh-lg rounded-0 border-0 py-2"
                      value="8"
                    >
                      8
                    </button>
                    <button
                      className="numpad-button position-relative btn btn-secondary btn-lg fs-3 lh-lg rounded-0 border-0 py-2"
                      value="9"
                    >
                      9
                    </button>
                    <button
                      className="numpad-button position-relative btn btn-secondary btn-lg fs-3 lh-lg rounded-0 border-0 py-2 numpad-price"
                      value="Precio"
                    >
                      Precio
                    </button>
                    <button
                      className="numpad-button position-relative btn btn-secondary btn-lg fs-3 lh-lg rounded-0 border-0 py-2 o_colorlist_item_numpad_color_3"
                      value="+/-"
                    >
                      +/-
                    </button>
                    <button
                      className="numpad-button position-relative btn btn-secondary btn-lg fs-3 lh-lg rounded-0 border-0 py-2"
                      value="0"
                    >
                      0
                    </button>
                    <button
                      className="numpad-button position-relative btn btn-secondary btn-lg fs-3 lh-lg rounded-0 border-0 py-2 o_colorlist_item_numpad_color_6"
                      value=","
                    >
                      ,
                    </button>
                    <button
                      className="numpad-button position-relative btn btn-secondary btn-lg fs-3 lh-lg rounded-0 border-0 py-2 o_colorlist_item_numpad_color_1"
                      value="⌫"
                    >
                      ⌫
                    </button>
                  </div>
                  <div className="actionpad d-flex flex-column gap-2">
                    <div className="validation d-flex gap-2">
                      <button className="pay pay-order-button button btn btn-primary btn-lg py-3 d-flex align-items-center justify-content-center flex-fill">
                        Pago
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rightpane d-flex flex-grow-1 flex-column bg-secondary">
              <div className="position-relative d-flex flex-column flex-grow-1 overflow-hidden">
                <div className="d-flex flex-wrap category-list gap-1 gap-lg-2 p-2">
                  <button className="category-button p-1 btn btn-light d-flex justify-content-center align-items-center rounded-3 o_colorlist_item_color_8">
                    {/* <img className="category-img-thumb h-100 rounded-3 object-fit-cover" alt="Categoría" src="/web/image?model=pos.category&amp;field=image_128&amp;id=1"> */}
                    {windowWidth > 991 && (
                      <img
                        src="/images/UpperBody.png"
                        alt=""
                        className="category-img-thumb h-100 rounded-3 object-fit-cover"
                      />
                    )}
                    <span className="px-2 text-center text-wrap-categ fs-5">Upper body</span>
                  </button>
                  <button className="category-button p-1 btn btn-light d-flex justify-content-center align-items-center rounded-3 o_colorlist_item_color_transparent_none opacity-50">
                    {/* <img className="category-img-thumb h-100 rounded-3 object-fit-cover" alt="Categoría" src="/web/image?model=pos.category&amp;field=image_128&amp;id=2"> */}
                    {windowWidth > 991 && (
                      <img
                        className="category-img-thumb h-100 rounded-3 object-fit-cover"
                        src="/images/Lowerbody.png"
                        alt=""
                      />
                    )}
                    <span className="px-2 text-center text-wrap-categ fs-5">Lower body</span>
                  </button>
                  <button className="category-button p-1 btn btn-light d-flex justify-content-center align-items-center rounded-3 o_colorlist_item_color_transparent_4 opacity-50">
                    {/* <img className="category-img-thumb h-100 rounded-3 object-fit-cover" alt="Categoría" src="/web/image?model=pos.category&amp;field=image_128&amp;id=3"> */}
                    {windowWidth > 991 && (
                      <img
                        className="category-img-thumb h-100 rounded-3 object-fit-cover"
                        src="/images/Others.png"
                        alt=""
                      />
                    )}
                    <span className="px-2 text-center text-wrap-categ fs-5">Others</span>
                  </button>
                </div>
                <div className="product-list d-grid gap-1 gap-lg-2 overflow-y-auto px-2 pt-0 pb-2">
                  <article
                    /*tabindex="0"*/ className="flex-column o_colorlist_item_color_transparent_8 product position-relative btn btn-light d-flex align-items-stretch p-0 rounded-3 text-start cursor-pointer"
                    data-product-id="61"
                    aria-labelledby="article_product_61"
                  >
                    <div className="product-information-tag position-absolute top-0 end-0 z-2 w-0 h-0 rounded-end-2 text-light text-center">
                      <FaInfo className="product-information-tag-logo fa fa-info" color="#fff" />
                    </div>
                    <div className="product-img ratio ratio-4x3 rounded-top rounded-3">
                      {/* <img className="w-100 o_object_fit_cover bg-200" src="/web/image?model=product.template&amp;field=image_128&amp;id=61&amp;unique=2025-04-30T16:36:44.000-05:00" alt="Black embroidered t-shirt"> */}
                    </div>
                    <div className="product-content d-flex h-100 my-1 px-2 rounded-bottom-3 flex-shrink-1">
                      <div className="overflow-hidden lh-sm product-name" id="article_product_61">
                        Black embroidered t-shirt
                      </div>
                      <span className="product-cart-qty position-absolute bottom-0 end-0 m-1 px-2 rounded bg-black text-white fs-5 fw-bolder">
                        1
                      </span>
                    </div>
                  </article>
                  <article
                    /*tabindex="0"*/ className="flex-column o_colorlist_item_color_transparent_8 product position-relative btn btn-light d-flex align-items-stretch p-0 rounded-3 text-start cursor-pointer"
                    data-product-id="59"
                    aria-labelledby="article_product_59"
                  >
                    <div className="product-information-tag position-absolute top-0 end-0 z-2 w-0 h-0 rounded-end-2 text-light text-center">
                      <FaInfo className="product-information-tag-logo fa fa-info" color="#fff" />
                    </div>
                    <div className="product-img ratio ratio-4x3 rounded-top rounded-3">
                      {/* <img className="w-100 o_object_fit_cover bg-200" src="/web/image?model=product.template&amp;field=image_128&amp;id=59&amp;unique=2025-04-30T16:36:44.000-05:00" alt="Casual T-shirt"> */}
                    </div>
                    <div className="product-content d-flex h-100 my-1 px-2 rounded-bottom-3 flex-shrink-1">
                      <div className="overflow-hidden lh-sm product-name" id="article_product_59">
                        Casual T-shirt
                      </div>
                      <span className="product-cart-qty position-absolute bottom-0 end-0 m-1 px-2 rounded bg-black text-white fs-5 fw-bolder">
                        1
                      </span>
                    </div>
                  </article>
                  <article
                    /*tabindex="0"*/ className="flex-column o_colorlist_item_color_transparent_8 product position-relative btn btn-light d-flex align-items-stretch p-0 rounded-3 text-start cursor-pointer"
                    data-product-id="65"
                    aria-labelledby="article_product_65"
                  >
                    <div className="product-information-tag position-absolute top-0 end-0 z-2 w-0 h-0 rounded-end-2 text-light text-center">
                      <FaInfo className="product-information-tag-logo fa fa-info" color="#fff" />
                    </div>
                    <div className="product-img ratio ratio-4x3 rounded-top rounded-3">
                      {/* <img className="w-100 o_object_fit_cover bg-200" src="/web/image?model=product.template&amp;field=image_128&amp;id=65&amp;unique=2025-04-30T16:36:44.000-05:00" alt="Classic Brown Jacket"> */}
                    </div>
                    <div className="product-content d-flex h-100 my-1 px-2 rounded-bottom-3 flex-shrink-1">
                      <div className="overflow-hidden lh-sm product-name" id="article_product_65">
                        Classic Brown Jacket
                      </div>
                      <span className="product-cart-qty position-absolute bottom-0 end-0 m-1 px-2 rounded bg-black text-white fs-5 fw-bolder">
                        1
                      </span>
                    </div>
                  </article>
                  <article
                    /*tabindex="0"*/ className="flex-column o_colorlist_item_color_transparent_8 product position-relative btn btn-light d-flex align-items-stretch p-0 rounded-3 text-start cursor-pointer"
                    data-product-id="71"
                    aria-labelledby="article_product_71"
                  >
                    <div className="product-information-tag position-absolute top-0 end-0 z-2 w-0 h-0 rounded-end-2 text-light text-center">
                      <FaInfo className="product-information-tag-logo fa fa-info" color="#fff" />
                    </div>
                    <div className="product-img ratio ratio-4x3 rounded-top rounded-3">
                      {/* <img className="w-100 o_object_fit_cover bg-200" src="/web/image?model=product.template&amp;field=image_128&amp;id=71&amp;unique=2025-04-30T16:36:44.000-05:00" alt="Cozy Sweater"> */}
                    </div>
                    <div className="product-content d-flex h-100 my-1 px-2 rounded-bottom-3 flex-shrink-1">
                      <div className="overflow-hidden lh-sm product-name" id="article_product_71">
                        Cozy Sweater
                      </div>
                    </div>
                  </article>
                  <article
                    /*tabindex="0"*/ className="flex-column o_colorlist_item_color_transparent_8 product position-relative btn btn-light d-flex align-items-stretch p-0 rounded-3 text-start cursor-pointer"
                    data-product-id="66"
                    aria-labelledby="article_product_66"
                  >
                    <div className="product-information-tag position-absolute top-0 end-0 z-2 w-0 h-0 rounded-end-2 text-light text-center">
                      <FaInfo className="product-information-tag-logo fa fa-info" color="#fff" />
                    </div>
                    <div className="product-img ratio ratio-4x3 rounded-top rounded-3">
                      {/* <img className="w-100 o_object_fit_cover bg-200" src="/web/image?model=product.template&amp;field=image_128&amp;id=66&amp;unique=2025-04-30T16:36:44.000-05:00" alt="Crocheted Poncho Unisize"> */}
                    </div>
                    <div className="product-content d-flex h-100 my-1 px-2 rounded-bottom-3 flex-shrink-1">
                      <div className="overflow-hidden lh-sm product-name" id="article_product_66">
                        Crocheted Poncho Unisize
                      </div>
                    </div>
                  </article>
                  <article
                    /*tabindex="0"*/ className="flex-column o_colorlist_item_color_transparent_8 product position-relative btn btn-light d-flex align-items-stretch p-0 rounded-3 text-start cursor-pointer"
                    data-product-id="74"
                    aria-labelledby="article_product_74"
                  >
                    <div className="product-information-tag position-absolute top-0 end-0 z-2 w-0 h-0 rounded-end-2 text-light text-center">
                      <FaInfo className="product-information-tag-logo fa fa-info" color="#fff" />
                    </div>
                    <div className="product-img ratio ratio-4x3 rounded-top rounded-3">
                      {/* <img className="w-100 o_object_fit_cover bg-200" src="/web/image?model=product.template&amp;field=image_128&amp;id=74&amp;unique=2025-04-30T16:36:44.000-05:00" alt="Jean Jacket"> */}
                    </div>
                    <div className="product-content d-flex h-100 my-1 px-2 rounded-bottom-3 flex-shrink-1">
                      <div className="overflow-hidden lh-sm product-name" id="article_product_74">
                        Jean Jacket
                      </div>
                    </div>
                  </article>
                  <article
                    /*tabindex="0"*/ className="flex-column o_colorlist_item_color_transparent_8 product position-relative btn btn-light d-flex align-items-stretch p-0 rounded-3 text-start cursor-pointer"
                    data-product-id="72"
                    aria-labelledby="article_product_72"
                  >
                    <div className="product-information-tag position-absolute top-0 end-0 z-2 w-0 h-0 rounded-end-2 text-light text-center">
                      <FaInfo className="product-information-tag-logo fa fa-info" color="#fff" />
                    </div>
                    <div className="product-img ratio ratio-4x3 rounded-top rounded-3">
                      {/* <img className="w-100 o_object_fit_cover bg-200" src="/web/image?model=product.template&amp;field=image_128&amp;id=72&amp;unique=2025-04-30T16:36:44.000-05:00" alt="Leather Jacket"> */}
                    </div>
                    <div className="product-content d-flex h-100 my-1 px-2 rounded-bottom-3 flex-shrink-1">
                      <div className="overflow-hidden lh-sm product-name" id="article_product_72">
                        Leather Jacket
                      </div>
                    </div>
                  </article>
                  <article
                    /*tabindex="0"*/ className="flex-column o_colorlist_item_color_transparent_8 product position-relative btn btn-light d-flex align-items-stretch p-0 rounded-3 text-start cursor-pointer"
                    data-product-id="60"
                    aria-labelledby="article_product_60"
                  >
                    <div className="product-information-tag position-absolute top-0 end-0 z-2 w-0 h-0 rounded-end-2 text-light text-center">
                      <FaInfo className="product-information-tag-logo fa fa-info" color="#fff" />
                    </div>
                    <div className="product-img ratio ratio-4x3 rounded-top rounded-3">
                      {/* <img className="w-100 o_object_fit_cover bg-200" src="/web/image?model=product.template&amp;field=image_128&amp;id=60&amp;unique=2025-04-30T16:36:44.000-05:00" alt="T shirt slim"> */}
                    </div>
                    <div className="product-content d-flex h-100 my-1 px-2 rounded-bottom-3 flex-shrink-1">
                      <div className="overflow-hidden lh-sm product-name" id="article_product_60">
                        T shirt slim
                      </div>
                      <span className="product-cart-qty position-absolute bottom-0 end-0 m-1 px-2 rounded bg-black text-white fs-5 fw-bolder">
                        1
                      </span>
                    </div>
                  </article>
                </div>
              </div>
              <div className="switchpane d-flex gap-2 p-2 border-top bg-view">
                <button className="btn-switchpane pay-button btn btn-lg flex-grow-1 btn-secondary">
                  <span className="d-block">Pagar</span>
                  <span>S/ 0,00</span>
                </button>
                <button className="btn-switchpane btn btn-secondary review-button flex-grow-1">
                  <span className="d-block">Carrito</span>
                  <small>0 artículos</small>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="o-main-components-container">
        <div className="o-overlay-container"></div>
        <div></div>
        <div className="render-container-parent" /*style="left: -1000px; position: fixed;"*/>
          <div></div>
          <div className="render-container"></div>
        </div>
        <div className="o_notification_manager"></div>
      </div>
    </div>
  )
}
export default PointOfSale
