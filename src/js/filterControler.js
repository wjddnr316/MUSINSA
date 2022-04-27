function activeFilter(menu){
  const menuAll = menu.closest('[role="menu"]').querySelectorAll('[role="menuitem"]');
  for(let i = 0; i < menuAll.length; i ++) {
    menuAll[i].setAttribute('aria-selected','false');
  }
  menu.setAttribute('aria-selected','true');
  filterScroll(menu);
}

function filterScroll(selectedItem){
  const selectedItemOffsetLeft = selectedItem.offsetLeft;
  const filterContainer = selectedItem.closest('[role="menu"]')
  const firstFilterItem = filterContainer.querySelectorAll('[role="menuitem"]')[0];
  filterContainer.scrollTo({
    left:selectedItemOffsetLeft - firstFilterItem.offsetLeft,
    behavior: 'smooth',
  }) 
}
