const $checkbox = document.getElementById("darkmodeBtn");

const isUserColorTheme = localStorage.getItem('color-theme');
const isOsColorTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const getUserTheme = () => isUserColorTheme ? isUserColorTheme : isOsColorTheme;

window.onload = function() {
  if (getUserTheme === 'dark') {
    localStorage.setItem('color-theme', 'dark');
    document.documentElement.setAttribute('color-theme', 'dark');
    $checkbox.setAttribute('checked', true)
  } else {
    localStorage.setItem('color-theme', 'light');
    document.documentElement.setAttribute('color-theme', 'light');
  }
}

$checkbox.addEventListener('click', e=> {
  if (e.target.checked) {
    localStorage.setItem('color-theme', 'light');
    document.documentElement.setAttribute('color-theme', 'dark');
  } else {
    localStorage.setItem('color-theme', 'dark');
    document.documentElement.setAttribute('color-theme', 'light');
  }
});