
document.querySelector('.load_time').setAttribute('datetime', Barge.TimeElapsed.iso8601(new Date()));
var te = new Barge.TimeElapsed(null, 'tw');
//var te = new Barge.TimeElapsed(null, navigator.language.replace('-', '_'));
te.render(document.querySelectorAll('.need_to_be_rendered'));

// 2. demo
document.getElementById('demo_now').innerHTML = new Barge.TimeElapsed().format(new Date());
document.getElementById('demo_20160907').innerHTML = new Barge.TimeElapsed(null, 'zh_CN').format('2016-09-07');
document.getElementById('demo_timestamp').innerHTML = new Barge.TimeElapsed().format(1473245023718);

//Barge.utils.forEach();