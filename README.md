# wan-address-select
a jquery address selector for China
----------

**demo**

> demo/test.html

**prepare to use**
> - include jQuery
> - include bulid/wan-address-select.css 
> - include build/wan-address-select.js
> - in your html:
> ```html
><div class="wan-address-select"></div>
>```

**how to use**
 

> `$(".wan-spinner").WanAddressSelect(options);`

**options**

> initProvice: default: '北京市'. 初始化插件时默认值，下同。
>
> initCity: default: '市辖区'.
>
> initCounty: default: '西城区'.
>
> initTown: default: '月坛街道办事处'.
>
> initVillage: default: '南礼士路社区居委会'.
>
> fineness: default: 'county'.  地址选择的精细度，可取值：[‘county’, 'town', 'village']


