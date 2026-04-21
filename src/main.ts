import './style.css'

const unicodeCharBlocks = [
    [0xE020, 0xE02B],
    [0xE031, 0xE035],
    [0xE038, 0xE044],
    [0xE048, 0xE04E],
    [0xE050, 0xE08A],
    [0xE08F, 0xE0C6],
    [0xE0D0, 0XE0DB]
]

let txtMacroString: HTMLTextAreaElement;
let frmMacroForm: HTMLFormElement;
let txtOutput: HTMLTextAreaElement;
let btnCopy: HTMLButtonElement;

document.onreadystatechange = () => {
    if(document.readyState == 'complete') {
        txtMacroString = document.getElementById('txtTemplate') as HTMLTextAreaElement
        txtOutput = document.getElementById('txtOutput') as HTMLTextAreaElement
        btnCopy = document.getElementById('btnCopy') as HTMLButtonElement

        const iconBlock = document.getElementById('customIconsBlock') as HTMLDivElement
        unicodeCharBlocks.forEach((block) => {
            for(let i = block[0]; i <= block[1]; i++) {
                const d = document.createElement('button')
                d.classList.add('font-mono', 'faux-btn')
                d.addEventListener('click', () => {
                    insertCharacter(String.fromCodePoint(i))
                })
                d.textContent = String.fromCodePoint(i)
                iconBlock.append(d)
            }
        })

        document.getElementById('btnShowHideChars')?.addEventListener('click', () => {
            document.getElementById('customIconsBlock')?.classList.toggle('hidden')
        })

        frmMacroForm = document.getElementById('frmMacroForm') as HTMLFormElement
        frmMacroForm.addEventListener('change', () => {
            generateOutput()
        })
        frmMacroForm.addEventListener('input', () => {
            generateOutput()
        })
        txtOutput.addEventListener('change', () => {
            txtOutput.style.height = 'auto'
            txtOutput.style.height = txtOutput.scrollHeight + 'px'
        })

        btnCopy.addEventListener('click', () => {
            const text = txtOutput.value
            if(text) {
                if(navigator.clipboard) {
                    navigator.clipboard.writeText(text)
                    .then(() => {
                        btnCopy.textContent = 'Copied!'
                        setTimeout(() => {
                            btnCopy.textContent = 'Copy'
                        }, 2000)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                }
            }
        })
    }
}

const insertCharacter = (charValue: any) => {
    txtMacroString.focus()
    const start = txtMacroString.selectionStart
    const end = txtMacroString.selectionEnd
    const before = txtMacroString.value.substring(0, start)
    const after = txtMacroString.value.substring(end)
    txtMacroString.value = before + charValue + after
    txtMacroString.selectionStart = txtMacroString.selectionEnd = start+1
    txtMacroString.dispatchEvent(new Event('change', {bubbles: true}))
}

const generateOutput = () => {
    const d = new FormData(frmMacroForm)
    const chatChannels = d.getAll('outputs')
    const txtMacroString = document.getElementById("txtTemplate") as HTMLTextAreaElement
    let s = ""
    chatChannels.forEach((channel) => {
        s += "/" + channel + " "
        s += txtMacroString.value
        s += "\n"
    })

    txtOutput.value = s.substring(0, s.length - 1)
    txtOutput.dispatchEvent(new Event('change', {bubbles: true}))
    
}