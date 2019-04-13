## compose函数组合 ##


    function compose(){
		const args = [].slice.call(arguments)
		return (data) => {
			return args.reduce((pre, fn)=>fn(pre),args.shift()(data))
		}
	}
	const f1 = (data) => {
		return [...data, 1]
	}
	const f2 = (data) => {
		return [...data, 2]
	}
	const composeFn = compose(f1, f2)

	const res = composeFn([1])
	console.log(res) // [1,2,3]