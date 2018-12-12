items = '';
cities = new Map();
appkey = '10003';
sign = 'b59bc3ef6191eb9f747dd4e83c99f2a4';

function addCities() {
    // console.log('loading');
    tmp = '';
    $.ajax({
        type:'get',
        async:false,
        url:'https://sapi.k780.com/?app=weather.city&appkey=' + appkey + '&sign=' + sign + '&format=json&jsoncallback=data&cou=1',
        dataType:'jsonp',
        jsonp:'callback',
        jsonpCallback:'data',
        success:function(data){
            if(data.success!='1'){
                alert(data.msgid+' '+data.msg);
                return;
            }
            tmp = data.result;
        },
        error:function(){
            alert('fail');
        }
    }).done(function(){
        for(i in tmp){
            if(cities[tmp[i].area_1]){}else{
                cities[tmp[i].area_1] = new Map();
            }
            if(cities[tmp[i].area_1][tmp[i].area_2]){}else{
                cities[tmp[i].area_1][tmp[i].area_2] = new Map();
            }
            if(tmp[i].area_3) {
                cities[tmp[i].area_1][tmp[i].area_2][tmp[i].area_3] = tmp[i].weaid;
            }else{
                cities[tmp[i].area_1][tmp[i].area_2]['请选择'] = tmp[i].weaid;
            }
        }
        tmp = document.getElementById('select-area1');
        for(key in cities){
            opt = document.createElement('option');
            // console.log(i);
            opt.text = key;
            tmp.add(opt);
        }
        $("#select-area1").trigger("change");
    });
}

function changeArea2(value){
    tmp = document.getElementById('select-area2');
    tmp.innerHTML = "";
    for(key in cities[value]){
        opt = document.createElement('option');
        // console.log(i);
        opt.text = key;
        tmp.add(opt);
    }
    $("#select-area2").trigger("change");
}

function changeArea3(value){
    tmp = document.getElementById('select-area3');
    tmp.innerHTML = "";
    area1 = document.getElementById('select-area1');
    area1 = area1[area1.selectedIndex].value;
    for(key in cities[area1][value]){
        opt = document.createElement('option');
        // console.log(i);
        opt.text = key;
        tmp.add(opt);
    }
}

function checkWeather(){
    tmp = '';
    area1 = document.getElementById('select-area1');
    area1 = area1[area1.selectedIndex].value;
    area2 = document.getElementById('select-area2');
    area2 = area2[area2.selectedIndex].value;
    area3 = document.getElementById('select-area3');
    area3 = area3[area3.selectedIndex].value;
    weaid = cities[area1][area2][area3];
    $.ajax({
        type:'get',
        async:false,
        url:'https://sapi.k780.com/?app=weather.future&weaid=' + weaid + '&appkey=' + appkey + '&sign=' + sign + '&format=json&jsoncallback=data',
        dataType:'jsonp',
        jsonp:'callback',
        jsonpCallback:'data',
        success:function(data){
            if(data.success!='1'){
                alert(data.msgid+' '+data.msg);
                return;
            }
            tmp = data.result;
        },
        error:function(){
            alert('fail');
        }
    }).done(function(){
        showWeather(cities[area1][area2][area3], tmp);
    });
}

function showWeather(weaid,data){
    for(i in data) {
        v = data[i];
        tmp = document.getElementById('day-' + i);
        tmp.innerHTML = '<p>' + v.days + '</p>' + '<img src="' + v.weather_icon + '"></img><br/>' + '<img src="' + v.weather_icon1 + '"></img>'
                        + '<p class="tem"><i>' + v.temperature + '</i></p><p class="win"><em><p>' + v.wind + '</p></em><i>' + v.winp + '</i></p>';
    }
    lifeIndex(weaid);
}

function lifeIndex(weaid){
    tmp = '';
    $.ajax({
        type:'get',
        async:false,
        url:'http://api.k780.com/?app=weather.lifeindex&weaid=' + weaid + '&appkey=' + appkey + '&sign=' + sign + '&format=json&jsoncallback=data',
        dataType:'jsonp',
        jsonp:'callback',
        jsonpCallback:'data',
        success:function(data){
            if(data.success!='1'){
                alert(data.msgid+' '+data.msg);
                return;
            }
            tmp = data.result;
        },
        error:function(){
            alert('fail');
        }
    }).done(function(){
        for(i in tmp){
            v = tmp[i];
            a = document.getElementById('life-' + i);
            a.innerHTML = '<p>' + v.lifeindex_ct_typenm + ': ' + checkData(v.lifeindex_ct_attr) + '</p>'
                            + '<p>' + v.lifeindex_kq_typenm + ': ' + checkData(v.lifeindex_kq_attr) + '</p>'
                            + '<p>' + v.lifeindex_uv_typenm + ': ' + checkData(v.lifeindex_uv_attr) + '</p>'
                            + '<p>' + v.lifeindex_xc_typenm + ': ' + checkData(v.lifeindex_xc_attr) + '</p>';
        }
        aqi(weaid);
    });
}

function aqi(weaid){
    tmp = '';
    $.ajax({
        type:'get',
        async:false,
        url:'http://api.k780.com/?app=weather.pm25&weaid=' + weaid + '&appkey=' + appkey + '&sign=' + sign + '&format=json&jsoncallback=data',
        dataType:'jsonp',
        jsonp:'callback',
        jsonpCallback:'data',
        success:function(data){
            if(data.success!='1'){
                alert(data.msgid+' '+data.msg);
                return;
            }
            tmp = data.result;
        },
        error:function(){
            alert('fail');
        }
    }).done(function(){
        v = document.getElementById('aqi');
        v.innerHTML = '今日AQI: ' + tmp.aqi + ' ' + tmp.aqi_levnm + '，' + tmp.aqi_remark;
    });
}

function checkData(msg){
    if(msg){
        return msg;
    }else{
        return '无';
    }
}