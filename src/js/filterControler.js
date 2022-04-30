function activeFilter(menu){
  const menuAll = menu.closest('[role="tablist"]').querySelectorAll('[role="tab"]');
  for(let i = 0; i < menuAll.length; i ++) {
    menuAll[i].setAttribute('aria-selected','false');
  }
  menu.setAttribute('aria-selected','true');
  filterScroll(menu);
}

function filterScroll(selectedItem){
  const selectedItemOffsetLeft = selectedItem.offsetLeft;
  const filterContainer = selectedItem.closest('[role="tablist"]')
  const firstFilterItem = filterContainer.querySelectorAll('[role="tab"]')[0];
  filterContainer.scrollTo({
    left:selectedItemOffsetLeft - firstFilterItem.offsetLeft,
    behavior: 'smooth',
  }) 
}
