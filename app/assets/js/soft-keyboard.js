const layouts = {
    'default': [
        ['1', '2', '3'], ['Caps', 'Shift', 'Back', 'OK'],
        ['4', '5', '6'], ['0', ',', '.', '/', ';', '\''],
        ['7', '8', '9'], ['`', '-', '=', '[', ']', '\\'],
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm', "&nbsp;"],
    ],
    'capsL': [
        ['!', '@', '#'], ['Caps', 'Shift', 'Back', 'OK'],
        ['$', '%', '^'], [')', '<', '>', '?', ':', '"'],
        ['&', '*', '('], ['~', '_', '+', '{', '}', '|'],
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M', "&nbsp;"],
    ],
    'shift1': [
        ['1', '2', '3'], ['Caps', 'Shift', 'Back', 'OK'],
        ['4', '5', '6'], ['0', '，', '。', '；', '‘', '’'],
        ['7', '8', '9'], ['·', '-', '=', '【', '】', '、'],
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm', "&nbsp;"],
    ],
    'shift2': [
        ['！', '@', '#'], ['Caps', 'Shift', 'Back', 'OK'],
        ['￥', '%', '…'], ['）', '《', '》', '？', '：', '“'],
        ['&', '*', '（'], ['~', '—', '+', '{', '}', '”'],
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M', "&nbsp;"],
    ],
}


class SoftKeyboard {
    constructor(selector) {
        this.element_ = document.querySelector(selector)
        console.log(this.element_.attributes)
        this.keys = []
        this.selectedId = 0
        this.maxId = -1
        this.CapsL = false
        this.Shift = false
        this.input_ = null
        this.onComplete = null
        this.resetKeyboard('default')
        this.bindInput()
    }

    resetKeyboard(layout) {
        this.layout = layout
        const keys = layouts[layout]
        if (!this.element_) {
            console.warn('element_ not found')
            return
        }
        this.keys = []
        this.element_.innerHTML = ''
        const self = this
        for (let i = 0; i < keys.length; i++) {
            const row = keys[i];
            for (let j = 0; j < row.length; j++) {
                const key = row[j];
                const ele = document.createElement('span')
                ele.innerHTML = key
                ele.dataset.value = key
                ele.dataset.id = this.keys.length
                ele.classList.add('skb-key')
                ele.addEventListener('click', (e) => {
                    console.log(e.target.dataset.value, 'clicked', e)
                    self.setActive(e.target.dataset.id)
                    self.click(e.target.dataset.id)
                })
                this.element_.appendChild(ele)
                this.keys.push(ele)
            }
        }

        const ok_text = this.element_.getAttribute('ok_text')
        if (ok_text) {
            this.keys[6].textContent = ok_text
        }
        this.maxId = this.keys.length - 1
        this.setActive(this.selectedId)
    }

    keyHandler(e) {
        console.log(e.code)
        var i = this.selectedId
        var step = 9
        // console.log(i, this.selectedId)
        switch (e.code) {
            case "ArrowUp":
                if (i >= 4 && i <= 12) {
                    i = i - step + 2 - (i >= 11)
                } else {
                    i = i - step
                }
                if (i < 0) {
                    i = i + this.keys.length
                }
                break;
            case "ArrowDown":
                if (i <= 3 || i >= 47) {
                    i = i + step - 2 + (i <= 48 && i >= 47)
                } else {
                    i = i + step
                }
                if (i > this.maxId) {
                    i = i - this.keys.length
                }
                break;
            case "ArrowLeft":
                i = i > 0 ? i - 1 : this.maxId
                break;
            case "ArrowRight":
                i = i < this.maxId ? i + 1 : 0
                break;
            case "Enter":
                this.click(i)
                break
            default:
                return false
        }
        if (i != this.selectedId) {
            this.setActive(i)
        }
        return true
    }

    setActive(i) {
        if (i < 0 || i > this.maxId) {
            return
        }
        this.keys.map((key, id) => {
            if (i == id) {
                this.selectedId = i
                key.classList.add('active')
            } else {
                key.classList.remove('active')
            }
        })
    }

    bindInput() {
        const targetId = this.element_.getAttribute('for')
        if (targetId)
            this.input_ = document.querySelector('#' + targetId)
    }

    click(i) {
        const k = this.keys[i]
        if (this.input_ && k) {
            switch (k.dataset.value) {
                case 'OK':
                    console.log('compulete', this.input_.value)
                    if (this.onComplete) {
                        this.onComplete(this.input_.value)
                    }
                    break
                case 'Caps':
                    if (this.layout != 'capsL') {
                        this.resetKeyboard('capsL')
                    } else {
                        this.resetKeyboard('default')
                    }
                    break
                case 'Shift':
                    if (this.layout == 'shift1') {
                        this.resetKeyboard('shift2')
                    } else if (this.layout == 'shift2') {
                        this.resetKeyboard('default')
                    } else {
                        this.resetKeyboard('shift1')
                    }
                    break
                case 'Back':
                    var len = this.input_.value.length
                    if (len >= 1) {
                        this.input_.value = this.input_.value.slice(0, len - 1)
                    }
                    break
                case '&nbsp;':
                    this.input_.value = this.input_.value + ' '
                    break
                default:
                    this.input_.value = this.input_.value + k.dataset.value
            }
        }
    }

}
