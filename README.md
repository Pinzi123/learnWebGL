# WebGL的学习项目
## 学习过程中写的一些简单滤镜
### [喝醉了](https://pinzi123.github.io/learnWebGL/webgl.html)
这个滤镜我把它叫做喝醉了，原来的名字忘了。就是根据RGB通道分离成三个影子，绕着中点打转。
### [高斯模糊](https://pinzi123.github.io/learnWebGL/blur.html)
高斯模糊 基于高斯方程 它很好的模拟了领域每个像素对当前处理像素的影响程度---距离越近，影响越大
### [素描效果](https://pinzi123.github.io/learnWebGL/webgl2.html)
主要是利用边缘检测因子来对屏幕图像进行边缘检测，实现描边的效果
## WebGL的一些简单例子
### [打篮球](https://pinzi123.github.io/learnWebGL/playBall.html)
主要是利用模板测试和混合测试生成了镜面反射的纹理，贴到有反射镜像的地板上
### [粒子之下雪了](https://pinzi123.github.io/learnWebGL/particle.html)
这里用到的是实例渲染
### [球体渐变成立方体](https://pinzi123.github.io/learnWebGL/SphereToCube.html)
莫得灵魂，就是利用mix方法慢慢改变顶点坐标，当它在正方体上就结束。影子暴露了我，还没写这方面。
### [阴影和雾化](https://pinzi123.github.io/learnWebGL/shadow.html)
绘制阴影就是利用了两个着色器，
先将视点移动至光源位置，并运行着色器一生成阴影贴图，记录片元的深度值
再将视点移动至原来位置，将每个片元的深度值与阴影贴图记录的对比，阴影贴图的Z值更大就在这个片元绘制阴影
## ThreeJS的学习例子
### [粒子之下雨了](https://pinzi123.github.io/learnWebGL/threejs/rain.html)
这里用到的是Sprite模型来实现
