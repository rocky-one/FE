## react-fiber ##
#### fiber架构是什么？

1. 是一种链表结构，一个节点通过指针可以找到想去的任何节点
2. fiber会把任务分片，分成多个任务单元，一个fiber结构相当于是一个单元。
3. fiber是一种任务调度，react16之前任务调度执行是一口气到底中间不可断。fiber实现了一种能够受自己控制的调用栈，可以中断调用栈，等到下一次调度再继续执行。
4. fiber通过requestIdleCallback实现任务的调度和把控制权主动交给浏览器(暂停任务)，让浏览器有机会执行更高优先级的任务。等到下一次调度再继续执行下一个任务。

requestIdleCallback兼容处理，react实现了自己的reqretIdleCallback方法，通过requestAnimationFrame拿到开始帧的时间，然后通过MessageChannel来实现。


react渲染主要分为两个阶段，第一阶段render可被打断(构造任务单元，diff对比)，第二阶段commit阶段不可被打断主要是渲染dom。