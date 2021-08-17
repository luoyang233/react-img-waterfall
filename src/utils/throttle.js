const throttle = (fn, delay = 200) => {
    let prev = new Date()
    return function () {
        const curr = new Date()
        if (curr - prev >= delay) {
            fn.apply(this, arguments)
            prev = curr
        }
    }
}

export { throttle }
