
document.querySelector('.load_time').setAttribute('datetime', Bee.TimeElapsed.iso8601(new Date()));
var te = new Bee.TimeElapsed(null, 'tw');
//var te = new Bee.TimeElapsed(null, navigator.language.replace('-', '_'));
te.render(document.querySelectorAll('.need_to_be_rendered'));

// 2. demo
document.getElementById('demo_now').innerHTML = new Bee.TimeElapsed().format(new Date());
document.getElementById('demo_20160907').innerHTML = new Bee.TimeElapsed(null, 'zh_CN').format('2016-09-07');
document.getElementById('demo_timestamp').innerHTML = new Bee.TimeElapsed().format(1473245023718);

//Bee.Utils.forEach();