(function () {

    const JSONP = "jsonp";

    var listNum = 0,
        smart_jd_area = "[{\"state_id\":1,\"city_id\":\"72\",\"town_id\":0,\"country_id\":\"2799\",\"city_name\":\"北京\"},{\"state_id\":2,\"city_id\":\"2813\",\"town_id\":0,\"country_id\":\"51976\",\"city_name\":\"上海\"},{\"state_id\":3,\"city_id\":\"51035\",\"town_id\":0,\"country_id\":\"39620\",\"city_name\":\"天津\"},{\"state_id\":4,\"city_id\":\"113\",\"town_id\":0,\"country_id\":\"9775\",\"city_name\":\"重庆\"},{\"state_id\":5,\"city_id\":\"142\",\"town_id\":0,\"country_id\":\"42540\",\"city_name\":\"河北\"},{\"state_id\":6,\"city_id\":\"303\",\"town_id\":\"51307\",\"country_id\":\"36780\",\"city_name\":\"山西\"},{\"state_id\":7,\"city_id\":\"412\",\"town_id\":0,\"country_id\":\"3547\",\"city_name\":\"河南\"},{\"state_id\":8,\"city_id\":\"560\",\"town_id\":0,\"country_id\":\"567\",\"city_name\":\"辽宁\"},{\"state_id\":9,\"city_id\":\"639\",\"town_id\":0,\"country_id\":\"640\",\"city_name\":\"吉林\"},{\"state_id\":10,\"city_id\":\"698\",\"town_id\":0,\"country_id\":\"699\",\"city_name\":\"黑龙江\"},{\"state_id\":11,\"city_id\":\"799\",\"town_id\":0,\"country_id\":\"3240\",\"city_name\":\"内蒙古\"},{\"state_id\":12,\"city_id\":\"904\",\"town_id\":0,\"country_id\":\"905\",\"city_name\":\"江苏\"},{\"state_id\":13,\"city_id\":\"1000\",\"town_id\":0,\"country_id\":\"1002\",\"city_name\":\"山东\"},{\"state_id\":14,\"city_id\":\"1114\",\"town_id\":\"19787\",\"country_id\":\"19783\",\"city_name\":\"安徽\"},{\"state_id\":15,\"city_id\":\"1158\",\"town_id\":0,\"country_id\":\"3412\",\"city_name\":\"浙江\"},{\"state_id\":16,\"city_id\":\"1303\",\"town_id\":0,\"country_id\":\"3483\",\"city_name\":\"福建\"},{\"state_id\":17,\"city_id\":\"1381\",\"town_id\":0,\"country_id\":\"3583\",\"city_name\":\"湖北\"},{\"state_id\":18,\"city_id\":\"1482\",\"town_id\":0,\"country_id\":\"3606\",\"city_name\":\"湖南\"},{\"state_id\":19,\"city_id\":\"1601\",\"town_id\":0,\"country_id\":\"3633\",\"city_name\":\"广东\"},{\"state_id\":20,\"city_id\":\"1715\",\"town_id\":\"51446\",\"country_id\":\"43114\",\"city_name\":\"广西\"},{\"state_id\":21,\"city_id\":\"1827\",\"town_id\":0,\"country_id\":\"3505\",\"city_name\":\"江西\"},{\"state_id\":22,\"city_id\":\"1930\",\"town_id\":0,\"country_id\":\"50947\",\"city_name\":\"四川\"},{\"state_id\":23,\"city_id\":\"2121\",\"town_id\":\"51472\",\"country_id\":\"22466\",\"city_name\":\"海南\"},{\"state_id\":24,\"city_id\":\"2144\",\"town_id\":\"51694\",\"country_id\":\"3906\",\"city_name\":\"贵州\"},{\"state_id\":25,\"city_id\":\"2235\",\"town_id\":\"28860\",\"country_id\":\"2246\",\"city_name\":\"云南\"},{\"state_id\":26,\"city_id\":\"2951\",\"town_id\":0,\"country_id\":\"2952\",\"city_name\":\"西藏\"},{\"state_id\":27,\"city_id\":\"2376\",\"town_id\":0,\"country_id\":\"4343\",\"city_name\":\"陕西\"},{\"state_id\":28,\"city_id\":\"2487\",\"town_id\":0,\"country_id\":\"2488\",\"city_name\":\"甘肃\"},{\"state_id\":29,\"city_id\":\"2580\",\"town_id\":\"21968\",\"country_id\":\"2581\",\"city_name\":\"青海\"},{\"state_id\":30,\"city_id\":\"2628\",\"town_id\":0,\"country_id\":\"2629\",\"city_name\":\"宁夏\"},{\"state_id\":31,\"city_id\":\"2652\",\"town_id\":0,\"country_id\":\"36684\",\"city_name\":\"新疆\"}]",
        smart_jd_areaObject = JSON.parse(smart_jd_area),
        smart_jd_stock_page = "<span id='smart_jd_stock_page' role='group'></span>",
        smart_jd_stock_display = "<span><button id='smartjd_stock_button' type='button'>一键查库存</button></span>",
        smart_jd_stock_panel = "<div class='is_stock'><ul class='smartjd_stock_list' id='smartjd_stock_list_panel'><li class='smartjd_stock_list-item active' id='smart_jd_close'><span class='column1'>配送区域</span><span class='column2'>电脑购买</span><span class='column3'>APP购买</span><span class='column4'>微信购买</span><span class='column5'>QQ购买</span><span class='column6'>库存</span><span class='column7'>是否有货</span> <span class='close_all'></span></li></ul><span class='triangle'></span></div>";

    //pageConfig为京东页面配置对象
    var skuid = pageConfig.product.skuid, //京东商品SKUID
        venderId = pageConfig.product.venderId, //京东商品销售商
        catalog = pageConfig.product.cat;//京东类目分类


    var $smartJD_stock, $smartJD_stock_display_button;
    var pricePc = 0, priceMo = 0, priceWx = 0, priceQQ = 0;


    function displayAllPrice() {
        ajaxPrice(JSONP);
    }

    function ajaxPrice(dataType) {
        var URL_PC = "http://p.3.cn/prices/get?type=1&skuid=J_" + skuid,  //PC端
            URL_APP = "http://pm.3.cn/prices/mgets?origin=2&skuIds=" + skuid, //APP端
            URL_WX = "http://pe.3.cn/prices/mgets?origin=5&skuids=" + skuid, //微信端
            URL_QQ = "http://pe.3.cn/prices/mgets?origin=4&skuids=" + skuid; //QQ端

        var
            getPCPriceAjaxDfd = $.Deferred(),
            getAPPPriceAjaxDfd = $.Deferred(),
            getWXPriceAjaxDfd = $.Deferred(),
            getQQPriceAjaxDfd = $.Deferred();

        var differArray = [];


        getPriceAjax(URL_PC, getPCPriceAjaxDfd);
        $.when(getPCPriceAjaxDfd).then(function (data) {
            pricePc = parseFloat(data[0].p).toFixed(2);
            differArray.push(0);
            getPriceAjax(URL_APP, getAPPPriceAjaxDfd);
        }, function (xhr) {
            console.log('调用京东API获取PC数据失败！')
            return xhr.reject().promise();
        });


        $.when(getAPPPriceAjaxDfd).then(function (data) {
            priceMo = parseFloat(data[0].p).toFixed(2);
            var difference = (pricePc - priceMo).toFixed(2);
            differArray.push(difference);
            generateHtml("APP 价", priceMo, difference);
            getPriceAjax(URL_WX, getWXPriceAjaxDfd);
        }, function (xhr) {
            console.log('调用京东API获取APP数据失败！')
            return xhr.reject().promise();
        });


        $.when(getWXPriceAjaxDfd).then(function (data) {
            priceWx = parseFloat(data[0].p).toFixed(2);
            var difference = (pricePc - priceWx).toFixed(2);
            differArray.push(difference);
            generateHtml("微 信 价", priceWx, difference);
            getPriceAjax(URL_QQ, getQQPriceAjaxDfd);
        }, function (xhr) {
            console.log('调用京东API获取微信数据失败！')
            return xhr.reject().promise();
        });


        $.when(getQQPriceAjaxDfd).then(function (data) {
            priceQQ = parseFloat(data[0].p).toFixed(2);
            var difference = (pricePc - priceQQ).toFixed(2);
            differArray.push(difference);
            generateHtml("QQ 价", priceQQ, difference);
            var maxDiffer = Math.max.apply(null, differArray);
            if (maxDiffer != 0) {
                $('.smartJDPricetttt:contains(' + maxDiffer + ')').find('.bestChoice').append('<span class="red"> 最优选择！</span>');
            }
        }, function (xhr) {
            console.log('调用京东API获取QQ数据失败！')
            return xhr.reject().promise();
        });


        function getPriceAjax(URL, dfd) {
            $.ajax({
                url: URL,
                dataType: dataType,
                success: function (data) {
                    dfd.resolve(data);
                },
                error: function (xhr) {
                    dfd.reject(xhr);
                }
            });
        }


        function generateHtml(title, price, difference) {
            if ("" != $("#summary-price").html()) {
                var newElement;
                if (window.location.host.indexOf("item.jd.com") > -1 || window.location.host.indexOf("item.yiyaojd.com") > -1) {
                    newElement = $("<div id='smartJDPrice' class='smartJDPricetttt' style='clear:both'><div class='dt'>" + title + "：</div><div class='dd'><strong><span id='jd-price-smartjd' class='p-price-smartjd'><em>￥</em>" + price + "</span></strong><span class='lowest'></span><span class='bestChoice'></span></div></div>");
                } else {
                    newElement = $("<div id='smartJDPrice' class='smartJDPricetttt' style='clear:both'><div class='dt'>" + title + "</div><div class='dd'><strong><span id='jd-price-smartjd-hk' class='p-price-smartjd-hk'><em>¥</em>" + price + "</span></strong><span class='lowest'></span><span class='bestChoice'></span></div></div>");
                }
                if (difference > 0) {
                    newElement.find(".lowest").append('<span> (省 <span class="red">' + difference + '</span> 元)</span>');
                }
                $("#summary-price").css({
                    height: "auto",
                }).append(newElement);
            }
        }


    }


    function insertHTML() {
        $smartJD_stock_display_button = $(smart_jd_stock_display);
        $('#summary-stock').before($smartJD_stock_display_button);

        $smartJD_stock = $(smart_jd_stock_page);
        $("#summary-stock").prepend($smartJD_stock);

    }

    function addStockButtonEventListening() {
        $('#smartjd_stock_button').live("click", function () {
            $("#smartjd_stock_list_panel,.smartjd_stock_list,.is_stock").remove(); //清除旧数据
            var panel = $(smart_jd_stock_panel);
            $smartJD_stock_display_button.append(panel);
            $("#smartjd_stock_list_panel > .active").click(function () {
                $(".is_stock").remove(); //关闭查库存页面
            });
            $("#summary-price").css({"overflow": "visible"});
            for (var e in smart_jd_areaObject) {
                panel = smart_jd_areaObject[e].city_name;
                $("#smartjd_stock_list_panel").append("<li class='smartjd_stock_list-item smartjd_stock_list-item-mini' id='c_" + smart_jd_areaObject[e].state_id + "_" + smart_jd_areaObject[e].city_id + "_" + smart_jd_areaObject[e].country_id + "'><span class='column1'>" + panel + "</span><span class='column2'>" + pricePc + "</span><span class='column3'>" + priceMo + "</span><span class='column4'>" + priceWx + "</span><span class='column5'>" + priceQQ + "</span></li>");
                $.ajax({
                    url: "http://c0.3.cn/stock?skuId=" + skuid + "&venderId=" + venderId + "&cat=" + catalog + "&area=" + smart_jd_areaObject[e].state_id + "_" + smart_jd_areaObject[e].city_id + "_" + smart_jd_areaObject[e].country_id + "_0&buyNum=1&extraParam={%22originid%22:%221%22}&ch=1",
                    dataType: JSONP,
                    context: $("#c_" + smart_jd_areaObject[e].state_id + "_" + smart_jd_areaObject[e].city_id + "_" + smart_jd_areaObject[e].country_id),
                    success: function (data) {
                        var stockNum = data.stock.stockDesc.replace(/[^0-9]+/g, '');
                        if (stockNum == '' || stockNum > 5) {
                            stockNum = ">5";
                        }
                        33 == data.stock.StockState ? this.append("<span class='column6'>" + stockNum + "</span><span class='column7'><span class='smartJD_red_bg'>现货</span></span>") : 40 == data.stock.StockState ? this.append("<span class='column6'>0</span><span class='column7'><span class='smartJD_red_bg'>调货</span></span>") : 36 == data.stock.StockState ? this.append("<span class='column6'>0</span><span class='column7'><span class='smartJD_red_bg'>预订</span></span>") : this.append("<span class='column6'>0</span><span class='column7'>无货</span>").remove();
                        listNum = $('.smartjd_stock_list-item-mini').length;
                        if (listNum == '0') {
                            $('#smart_jd_close').html('<span class="all_not">全国无货</span><span class="close_all"></span>').css({color: 'red'});
                        }
                    }
                });
            }
        });


    }


    function doWork() {
        insertHTML(); //插入相关DOM HTML

        displayAllPrice(); //显示所有客户端价格信息

        addStockButtonEventListening();  //一键查库存事件监听显示全国库存列表
    }


    doWork();


})();




