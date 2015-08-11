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
> 
> ```html
><div class="wan-address-select"></div>
> ```

**how to use**

> init component
> ```javascript
> $(".wan-spinner").WanAddressSelect(options);
> ```


> get value
> ```javascript
> $(".wan-spinner").WanAddressSelect("val");
>
> result: {
	"province" : "北京市",
	"city" : "市辖区",
	"county" : "西城区",
	"town" : "月坛街道办事处"
}
> ```


> get value and id
> ```javascript
> $(".wan-spinner").WanAddressSelect("idval");
>
> result: {
	"provinceId" : 110,
	"province" : "北京市",
	"cityId" : 110100000000,
	"city" : "市辖区",
	"countyId" : 110102000000,
	"county" : "西城区",
	"townId" : 110102007000,
	"town" : "月坛街道办事处"
}
> ```

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
>
> *url*: the component path. exp. if the component is in lib/jquery-wan-address-select, this should be 'lib/' 

**important**

options' url must be set, otherwise the component can't find the data it needs. or you can put the build/data in your own server, and change the getData function in build/wan-address-select.js.
