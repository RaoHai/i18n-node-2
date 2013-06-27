/*
 * front-end i18n support
 */
/*global $, window, vsprintf*/
$(function () {
  var I18n, slice;
  slice = Array.prototype.slice;

  I18n = function () {
    var storage, init, lang, dict;

    storage = window.localStorage;
    init = function () {
      $.getJSON("i18n", function (i18n) {
        dict = storage.lang = JSON.stringify(i18n);
      });
    };

    if (storage.lang === undefined) {
      init();
    }

    dict = JSON.parse(storage.lang);
    lang = $('html').attr('lang') || 'en';

    window.__ = function () {
      var curdict, key, msg, args;
      curdict = dict[lang];
      args = slice.apply(arguments, 0);
      key = args.shift();

      if (curdict === undefined) {
        return key;
      }
      if (curdict[key] === undefined) {
        $.ajax({
          url : "i18n",
          type : "post",
          data : {'key' : key},
          success : function (value) {
          }
        });
        return key;
      }

      msg = curdict[key];

      if (arguments.length > 1) {
        msg = vsprintf(msg, args);
      }
      return msg;
    };

    $.extend(this, {
      init : init,
      list : function () {
        var en, ch, curdict, tbody;
        curdict = dict['zh-CN'];
        $tbody = $('table').find('tbody');
        for (en in curdict) {
          if (curdict.hasOwnProperty(en) && curdict[en] == en) {
            $tr =  $("<tr />");
            $tr.append($('<td />', {
              text: en
            }));
            $tr.append($('<td />').html('<input type="text" name="'+ en + '" value="' + curdict[en] + '" />')
              );
            $tbody.append($tr);
          }
        }
      }
    });
  };

  window.i18n = new I18n();


});