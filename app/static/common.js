function getQuery() {
    var query = window.location.hash.substring(1);
    var vars = query.split("&");
    var obj = {}
    if (vars.length > 0) {
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            obj[pair[0]] = pair[1]
        }
    } else {
        var pair = query.split("=");
        if (pair.length == 2) {
            obj[pair[0]] = pair[1]
        }
    }
    return obj
}

let prompt = (title, inputValue = '') => {
    return new Promise(resolve => {
        Swal.fire({
            title: title,
            input: 'text',
            // inputLabel: title,
            inputValue: inputValue,
            inputValidator: (value) => {
                if (!value) {
                    return '你需要输入有效数据'
                }
            }
        }).then(result => {
            console.log(result)
            resolve(result.value)
        })
    })
}
/*
function capture(rasterElement) {
    return tf.tidy(() => {
        const pixels = tf.browser.fromPixels(rasterElement);

        // crop the image so we're using the center square
        const cropped = cropTensor(pixels);

        // Expand the outer most dimension so we have a batch size of 1
        const batchedImage = cropped.expandDims(0);

        // Normalize the image between -1 and a1. The image comes in between 0-255
        // so we divide by 127 and subtract 1.
        return batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
    });
}


function cropTensor(img) {
    const size = Math.min(img.shape[0], img.shape[1]);
    const centerHeight = img.shape[0] / 2;
    const beginHeight = centerHeight - (size / 2);
    const centerWidth = img.shape[1] / 2;
    const beginWidth = centerWidth - (size / 2);
    return img.slice([beginHeight, beginWidth, 0], [size, size, 1]);
}
*/