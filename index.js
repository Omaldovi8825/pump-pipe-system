let diametroInput = document.querySelector("#diametro")
let longitudInput = document.querySelector("#longitud")
let rugosidadInput = document.querySelector("#rugosidad")
let alturaInput = document.querySelector("#diferencia-carga")
let descargaInput = document.querySelector("#descarga")
let indicadorValorCarga = document.querySelector("#valor-carga")
let valorAltura = document.querySelector("#valor-altura")
let hf = document.querySelector("#hf")
let pow = document.querySelector("#power")
let eta = document.querySelector("#eta")
let reynolds = document.querySelector("#reynolds")
let shower = document.querySelector(".shower")

//eventos
descargaInput.addEventListener("input", () => {
    let valorDescargaInput = descargaInput.value
    indicadorValorCarga.innerHTML = descargaInput.value
    hf.innerHTML = perdidasFriccion().toFixed(2)
    pow.innerHTML = power().toFixed(1)
    eta.innerHTML = tablaDescarga().eficiencia
    reynolds.innerHTML = reynoldsNumber()
    showerChange(valorDescargaInput)
})
alturaInput.addEventListener("input", () => valorAltura.innerHTML = alturaInput.value)

const GRAVITY = 9.81
const RHO = 1000

valorAltura.innerHTML = alturaInput.value

//funcion para controlar el chorrito
function showerChange(descarga){
    let ht = perdidasTotales()
    let pumpHead = tablaDescarga().pumpHead
    let m = (100-58)/65
    let b = 100 - (70*m)
    let x = m*descarga + b
    let m2 = -42/65
    let b2 = -m2 * 70
    let y = m2 * descarga + b2
    if(ht > pumpHead || descarga == 0){
        shower.style.opacity = "0"
        shower.style.clipPath = `polygon(42% 0%, 58% 0%, 58% 100%, 42% 100%)`
    } else {
        shower.style.opacity = "1"
        shower.style.clipPath = `polygon(42% 0%, 58% 0%, ${x}% 100%, ${y}% 100%)`
    }
}

function lamda(){
    let e = rugosidadInput.value / 1000
    let d = diametroInput.value / 1000
    return Math.pow((1/(2*Math.log10((e/d)/3.7))), 2)
}

function velocidad(){
     Q = descargaInput.value / 1000
     D = diametroInput.value / 1000
     return 4 * Q / (Math.PI * Math.pow(D, 2) )
}

//perdidas por friccion
function perdidasFriccion(){
    let l = longitudInput.value
    let d = diametroInput.value / 1000
    let v = velocidad()
    let lam = lamda()
    return lam * (l/d) * (Math.pow(v, 2) / (2 * GRAVITY))
}

//perdidas totales
function perdidasTotales(){
    let Hf = perdidasFriccion()
    let H = Number(alturaInput.value)
    return H + Hf
}

//calcular la potencia
function power(){
    let Q = descargaInput.value / 1000
    let pumpHead = perdidasTotales()
    let eficiencia = tablaDescarga().eficiencia
    return (RHO * GRAVITY * Q * pumpHead / (eficiencia/100))/1000
}

//calcula numero de Reynolds
function reynoldsNumber(){
    let V = velocidad()
    let D = Number(diametroInput.value / 1000)
    let Nu = 1e-6
    let result = Number(V * D / Nu) 
    return result.toExponential(2)
}

//asigna valores a pump head y eficiencia segun la descarga
function tablaDescarga(){
    //tabla descarga - pumphead - eficiencia
    let descarga = Number(descargaInput.value)
    let pumpHead
    let eficiencia

    switch(descarga){
        case 0:
            pumpHead = 26.25
            eficiencia = 0
            break
        case 5:
            pumpHead = 25.13
            eficiencia = 14
            break
        case 10:
            pumpHead = 24
            eficiencia = 28
            break
        case 15:
            pumpHead = 22.88
            eficiencia = 40
            break
        case 20:
            pumpHead = 21.75
            eficiencia = 51
            break
        case 25:
            pumpHead = 20.63
            eficiencia = 60
            break
        case 30:
            pumpHead = 19.5
            eficiencia = 68
            break
        case 35:
            pumpHead = 18.5
            eficiencia = 74
            break
        case 40:
            pumpHead = 17.5
            eficiencia = 80
            break
        case 45:
            pumpHead = 16.25
            eficiencia = 83
            break
        case 50:
            pumpHead = 15
            eficiencia = 85
            break
        case 55:
            pumpHead = 13.38
            eficiencia = 83
            break
        case 60:
            pumpHead = 11.75
            eficiencia = 80
            break
        case 65:
            pumpHead = 9.25
            eficiencia = 74
            break
        case 70:
            pumpHead = 6.75
            eficiencia = 64
            break
        default:
            pumpHead = 0
            eficiencia = 0
            break
    }

    return {
        pumpHead,
        eficiencia
    }
}

// menor a 0 no hay chorrito

// chorrito proporcional a q

// cuando perdidas totales son mayor a pump head ya no hay chorrito

//numero reynolds
//Re = V * D / Nu
//Nu = 10-6