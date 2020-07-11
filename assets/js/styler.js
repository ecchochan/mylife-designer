function styler(namespace, styles) {
  var name = 'styler-' + (namespace || 'default');
  var style_div = document.getElementById(name);
  if (!style_div) {
    style_div = document.createElement('style');
    style_div.id = name
    document.body.appendChild(style_div);
  }
  style_div.innerHTML = styles;
}

export {
  styler
};