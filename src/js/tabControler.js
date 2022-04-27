function activeTab(tab) {
  const connectPanel = document.getElementById(tab.getAttribute('aria-controls'));
  const tabArray = tab.parentElement.querySelectorAll('[role="tab"]');
  const panelArray = connectPanel.parentElement.querySelectorAll('[role="tabpanel"]')

  deactiveTab(tabArray,panelArray);

  tab.classList.add('selected');
  tab.setAttribute('aria-selected','true');
  connectPanel.style.display = 'block';
}

function deactiveTab(tab,panel){
  for(let i = 0; i < tab.length; i ++){
    tab[i].classList.remove('selected');
    tab[i].setAttribute('aria-selected','false');
    panel[i].style.display = 'none';
  }
}