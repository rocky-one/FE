## js性能优化总结 ##

#### 根据performance api

关键事件
名词	全称	                  解释
FP	firstPaint	            首次绘制
FCP	firstContentfulPaint	  首次内容绘制
LCP	largestContentfulPaint	最大内容绘制
DCL	domContentLoaded	      dom内容解析完成
L	  loaded	                页面的load事件

// FP
const fp = w.filter(entry => entry.name == 'first-paint')[0].startTime;

// FCP
const fcp = performance.getEntries('paint').filter(entry => entry.name == 'first-contentful-paint')[0].startTime;

// 或者调用 new PerformanceObserver
const observer = new PerformanceObserver(entryList => {
    for (const entry of entryList.getEntries()) {
        if (entry.element) {
            var selector = entry.element.tagName.toLowerCase();
            if (entry.element.id) {
                selector = selector + '#' + entry.element.id;
            }
        }
        
        const strEntry = JSON.stringify(entry).replace('"startTime"', '"element":"' + selector + '","startTime"');
        console.dir(entry);
        
        setTimeout(() => {
            output.innerHTML += strEntry + '<br>';
        }, 200);
    }
});
// LCP
observer.observe({
  entryTypes: ['largest-contentful-paint']
});

// TTI
TTI是整个页面完全加载后，用户可交互时间。FCI是首次可交互的时间。最典型的就是大图渲染，资源都加载好了，浏览器还需要一定时间渲染大图，这个时候和页面进行交互，就是FCI，等大图渲染结束后的交互，就是TTI。
确定 TTI 得分
在这个时间范围内，我们应该寻找一个时刻，即浏览器在「静默窗口之前」完成了「最后一个长时间任务」。
如果FCP后「没有任何超过50毫秒的任务」，我们的TTI等于我们的FCP。


// FID First Input Delay 对应first-input类型，是交互性能指标。
FID 测量从用户第一次与页面交互，直到浏览器对交互作出响应，并实际能够开始处理事件处理程序所经过的时间。
FID测量页面加载期间响应度，它针对的交互是不连续操作对应的输入事件，如点击、轻触和按键。其他诸如滚动和缩放之类的交互属于连续操作并不包含在她的测量内。


#### DOM方面优化 
* 多次appendChild使用document.createDocumentFragment()
```javascript
for(let i = 0; i<10; i++){
	let ele = document.createElement('div')
	document.body.appendChild(ele)
}
// 替换为
let frag = document.createDocumentFragment()
for(let i = 0;i<10; i++){
	let ele = document.createElement('div')
	frg.appendChild(ele)
}
document.body.appendChild(frag)
```