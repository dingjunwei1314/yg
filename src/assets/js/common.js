export default{
    install(Vue){
        //时间格式化
        Vue.prototype.formatDate = (date, fmt) => {
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            let o = {
                'M+': date.getMonth() + 1,
                'd+': date.getDate(),
                'h+': date.getHours(),
                'm+': date.getMinutes(),
                's+': date.getSeconds()
            };
            for (let k in o) {
                if (new RegExp(`(${k})`).test(fmt)) {
                    let str = o[k] + '';
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
                }
            }
            return fmt;
        },
        // `v-checkup` 检查元素的权限指令
        Vue.directive('checkup', {
            inserted(el,binding){
                function removeSelf() {
                    if(el.parentNode){
                        el.parentNode.removeChild(el);
                    }else {
                        setTimeout(removeSelf,20);
                    }
                }
                if(JSON.parse(localStorage.permission).indexOf(binding.value)<0){
                    removeSelf();
                }
            }
        })

    }
}
