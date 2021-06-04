(() => {
    let back = false
    let home = false
    let exit = false
    let handler = (ev) => {
        // handle for exit
        if (ev.code == 'F2') {
            back = ev.type == 'keydown' ? true : false
            setTimeout(() => {
                if (back) {
                    setTimeout(() => {
                        if (back) {
                            window.history.back();
                        }
                    }, 500)
                }
            }, 500)
        } else if (ev.code == 'F1') {
            home = ev.type == 'keydown' ? true : false
            setTimeout(() => {
                if (home) {
                    setTimeout(() => {
                        if (home) {
                            window.location.assign('/app#!/index')
                        }
                    }, 500)
                }
            }, 500)
        }
    }

    window.addEventListener('keydown', handler);
    window.addEventListener('keyup', handler);

})()