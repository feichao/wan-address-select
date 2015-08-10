;
(function($, window, document, undefined) {
  'use strict';
  var basicData = [{
    id: 110,
    name: '北京市',
  }, {
    id: 120,
    name: '天津市',
  }, {
    id: 130,
    name: '河北省',
  }, {
    id: 140,
    name: '山西省',
  }, {
    id: 150,
    name: '内蒙古自治区',
  }, {
    id: 210,
    name: '辽宁省',
  }, {
    id: 220,
    name: '吉林省',
  }, {
    id: 230,
    name: '黑龙江省',
  }, {
    id: 310,
    name: '上海市',
  }, {
    id: 320,
    name: '江苏省',
  }, {
    id: 330,
    name: '浙江省',
  }, {
    id: 340,
    name: '安徽省',
  }, {
    id: 350,
    name: '福建省',
  }, {
    id: 360,
    name: '江西省',
  }, {
    id: 370,
    name: '山东省',
  }, {
    id: 410,
    name: '河南省',
  }, {
    id: 420,
    name: '湖北省',
  }, {
    id: 430,
    name: '湖南省',
  }, {
    id: 440,
    name: '广东省',
  }, {
    id: 450,
    name: '广西壮族自治区',
  }, {
    id: 460,
    name: '海南省',
  }, {
    id: 500,
    name: '重庆市',
  }, {
    id: 510,
    name: '四川省',
  }, {
    id: 520,
    name: '贵州省',
  }, {
    id: 530,
    name: '云南省',
  }, {
    id: 540,
    name: '西藏自治区',
  }, {
    id: 610,
    name: '陕西省',
  }, {
    id: 620,
    name: '甘肃省',
  }, {
    id: 630,
    name: '青海省',
  }, {
    id: 640,
    name: '宁夏回族自治区',
  }, {
    id: 650,
    name: '新疆维吾尔自治区',
  }];

  Array.prototype.uniqueObjectArray = function() {
    var x = {};
    var result = [];
    $.each(this, function(index, dt) {
      if (!x[dt.id]) {
        x[dt.id] = dt.name;
        result.push(dt);
      }
    });
    return result;
  };

  var WanAddressSelect = function(element, options) {
    var finenessList = ['county', 'town', 'village'];
    this.defaults = {
      initProvice: '北京市',
      initCity: '市辖区',
      initCounty: '东城区',
      initTown: '东华门街道办事处',
      initVillage: '多福巷社区居委会',
      fineness: 'county'
    };

    this.options = $.extend({}, this.defaults, options);
    this.options.fineness = $.inArray(this.options.fineness, finenessList) !== -1 ? this.options.fineness : finenessList[0];

    this.element = element;
    this.enableTown = false;
    this.enableVillage = false;
  };

  WanAddressSelect.prototype.initDom = function() {
    var self = this;

    var content = ['<select id="province"></select>',
      '<select id="city"></select>',
      '<select id="county"></select>'
    ];

    if (self.options.fineness === 'town') {
      content.push('<select id="town"></select>');
      self.enableTown = true;
    }

    if (self.options.fineness === 'village') {
      content.push('<select id="town"></select>');
      content.push('<select id="village"></select>');
      self.enableTown = true;
      self.enableVillage = true;
    }

    self.element.append(content.join(''));

    self.province = self.element.children('#province');
    self.city = self.element.children('#city');
    self.county = self.element.children('#county');
    self.town = self.element.children('#town');
    self.village = self.element.children('#village');

    $.each(basicData, function(index, bd) {
      self.province.append('<option value=' + bd.name + ' data-id=' + bd.id + '>' + bd.name + '</option>');
    });

    self.province.val(self.options.initProvice);

    var provinceId = $(self.province).find(':selected').data('id');
    self.getData(provinceId, function(result) {
      self.wholeData = result;
      self.initData();
    });
  };

  WanAddressSelect.prototype.bind = function() {
    var self = this;
    self.element.delegate('#province', 'change', function() {
      var provinceId = $(this).find(':selected').data('id');
      self.getData(provinceId, function(result) {
        self.wholeData = result;
        self.setData();
      });
    }).delegate('#city', 'change', function() {
      var cityName = $(this).find(':selected').val();
      var country = self.getCounty(cityName);
      self.setCounty(country);
      self.county.trigger('change');
    }).delegate('#county', 'change', function() {
      var townName = $(this).find(':selected').val();
      if (self.enableTown) {
        var town = self.getTown(townName);
        self.setTown(town);
      }
      self.town.trigger('change');
    }).delegate('#town', 'change', function() {
      var villageName = $(this).find(':selected').val();
      if (self.enableVillage) {
        var village = self.getVillage(villageName);
        self.setVillage(village);
      }
    });
  };

  WanAddressSelect.prototype.initData = function() {
    var city = this.getCity();
    this.setCity(city, this.options.initCity);

    var county = this.getCounty(this.options.initCity);
    this.setCounty(county, this.options.initCounty);

    var town = this.enableTown ? this.getTown(this.options.initCounty) : undefined;
    town && this.setTown(town, this.options.initTown);

    var village = this.enableVillage ? this.getVillage(this.options.initTown) : undefined;
    village && this.setVillage(village, this.options.initVillage);
  };

  WanAddressSelect.prototype.getData = function(provinceId, cb) {
    $.get('http://localhost:4001/data/' + this.options.fineness + '/' + provinceId + '.json', function(result) {
      cb(result);
    }, 'json');
  };

  WanAddressSelect.prototype.getCity = function() {
    return $.map(this.wholeData, function(dt) {
      return {
        id: dt.city_id,
        name: dt.city_name
      };
    }).uniqueObjectArray();
  };

  WanAddressSelect.prototype.getCounty = function(cityName) {
    return $.map($.grep(this.wholeData, function(dt) {
      return dt.city_name === cityName;
    }), function(dt) {
      return {
        id: dt.county_id,
        name: dt.county_name
      };
    }).uniqueObjectArray();
  };

  WanAddressSelect.prototype.getTown = function(countryName) {
    return $.map($.grep(this.wholeData, function(dt) {
      return dt.county_name === countryName;
    }), function(dt) {
      return {
        id: dt.town_id,
        name: dt.town_name
      };
    }).uniqueObjectArray();
  };

  WanAddressSelect.prototype.getVillage = function(townName) {
    return $.map($.grep(this.wholeData, function(dt) {
      return dt.town_name === townName;
    }), function(dt) {
      return {
        id: dt.village_id,
        name: dt.village_name
      };
    }).uniqueObjectArray();
  };

  WanAddressSelect.prototype.setData = function(isInit) {
    var city = this.getCity();
    this.setCity(city);

    var county = this.getCounty(this.city.val());
    this.setCounty(county);

    var town = this.enableTown ? this.getTown(this.county.val()) : undefined;
    town && this.setTown(town);

    var village = this.enableVillage ? this.getVillage(this.town.val()) : undefined;
    village && this.setVillage(village);
  };

  WanAddressSelect.prototype.setCity = function(city, selectValue) {
    var self = this;
    self.city.html('');
    $.each(city, function(index, dt) {
      self.city.append('<option value=' + dt.name + ' data-id=' + dt.id + '>' + dt.name + '</option>');
    });
    selectValue ? self.city.val(selectValue) : self.city.val(self.city.children(':first').val());
  };

  WanAddressSelect.prototype.setCounty = function(county, selectValue) {
    var self = this;
    self.county.html('');
    $.each(county, function(index, dt) {
      self.county.append('<option value=' + dt.name + ' data-id=' + dt.id + '>' + dt.name + '</option>');
    });
    selectValue ? self.county.val(selectValue) : self.county.val(self.county.children(':first').val());
  };

  WanAddressSelect.prototype.setTown = function(town, selectValue) {
    var self = this;
    self.town.html('');
    $.each(town, function(index, dt) {
      self.town.append('<option value=' + dt.name + ' data-id=' + dt.id + '>' + dt.name + '</option>');
    });
    self.town.val(selectValue)
    selectValue ? self.town.val(selectValue) : self.town.val(self.town.children(':first').val());
  };

  WanAddressSelect.prototype.setVillage = function(village, selectValue) {
    var self = this;
    self.village.html('');
    $.each(village, function(index, dt) {
      self.village.append('<option value=' + dt.name + ' data-id=' + dt.id + '>' + dt.name + '</option>');
    });
    selectValue ? self.village.val(selectValue) : self.village.val(self.village.children(':first').val());
  };

  var getValue = function(element) {
    return {
      province: element.children('#province').val(),
      city: element.children('#city').val(),
      county: element.children('#county').val(),
      town: element.children('#town').val(),
      village: element.children('#village').val()
    };
  };

  $.fn.WanAddressSelect = function() {
    var arg = arguments[0];
    if (typeof(arg) === 'object') {
      this.each(function(index, element) {
        var wanAddressSelect = new WanAddressSelect($(element), arg);
        wanAddressSelect.initDom();
        wanAddressSelect.bind();
      });
      return this;
    } else {
      if ($(this).length > 1) {
        $.error('can\'t get value because of multiple elements are slected via selector "' + $(this).selector + '" !!!!');
      } else {
        switch (arg) {
          case 'val':
            return getValue($(this));
          default: 
          	$.error('can\'t find method: "' + arg + '" !!!!');
        }
      }
    }
  };

})(jQuery, window, document)
