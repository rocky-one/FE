## react diff算法

以多个节点为例

1. 老节点是一个fiber对象，oldFiber。新节点是一个数组newChildren，通过React.createElement创建，也就是VDOM，内部有key，type属性，描述的JSX结构。

2. 整个diff对比完成最多会进行3次for循环，也可能2次循环就完成。

3. 第一次循环新节点数组newChildren，会有几种不同的情况。这一步主要是处理更新的。
    - newChildren没有遍历完，oldFiber也没有遍历完。1.key发生变化，2. type变化。
    - newChildren遍历完 或者 oldFiber遍历完，或者newChildren和oldFiber都遍历完成。1. 有删除的节点，2. 有新增的节点

4. 第二次循环从上一次循环结束的index开始。这一步主要是处理新增节点和删除节点
    - 如果是key和type变化那么index开始的位置重新创建节点
    - 如果是newChildren遍历完 oldFiber没有遍历完成说明是删除
    - 如果是oldFiber遍历完成 newChildren没有遍历完成说明是新增

5. 第三次循环交换节点位置
    - 根据lastPlacedIndex和oldIndex来判断是否移动，lastPlacedIndex表明最后一个可复用节点的位置，默认值为0。
    - 比如ABCD => DABC，第一次循环新节点D的oldIndex=3，现在位于第一个位置了。lastPlacedIndex(0) < oldIndex(3) 不移动，lastPlacedIndex = oldIndex。
    - 循环继续i++后A的oldIndex=0, lastPlacedIndex(3) > oldIndex(0) 移动，lastPlacedIndex = lastPlacedIndex 保持不变。
    - 循环继续i++后B的oldIndex=1, lastPlacedIndex(3) > oldIndex(1) 移动，lastPlacedIndex = lastPlacedIndex 保持不变。


- key的作用，diff对比时通过唯一值key来比较，提高复用性。
- index做为key，如果下一次节点顺序改变可能导致节点和文本内容错乱对应不上的情况。
- 没有key diff计算可能会增加。比如下面只是文本变了，其实key没有变节点可以复用只要更新text即可。没有key就导致对应不上无法复用p节点，react会重新创建p节点

```
const a = (
    <>
      <p>0</p>
      <p>1</p>
    </>
  );
const b = (
  <>
    <p>1</p>
    <p>0</p>
  </>
);
```



## vue diff算法

vue中diff算法有四个变量标记，oldStartIdx、oldEndIdx、newStartIdx、newEndIdx。
1. 新头和老头比，如果不一致第2步骤。如果一致指针共同++。
2. 新尾和老尾比，如果不一致第3步骤。如果一致newStartIdx++，oldEndIdx--。
3. 新头和老尾比，如果不一致第4步骤。
4. 新尾和老头比，如果不一致第5步骤。
5. 如果上面四种方法都匹配不到，最后针对newStartVnode这个节点暴力循环oldCh中剩余的节点去做匹配，

