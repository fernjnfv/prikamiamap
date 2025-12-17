const infoBlock = document.querySelector(".info");
let resoran_inactive = new Image();
resoran_inactive.src = "restaurant_icon.svg";
let resoran_active = new Image();
resoran_active.src = "restaurant_icon_cover.svg";
let resoran_selected = new Image();
resoran_selected.src = "restaurant_icon_selected.svg";
const iconPath = new Path2D(); // Создаём круглый Path2D
iconPath.arc(20, 20, 18, 0, Math.PI * 2);
let selectedRestaurant = null;
let showMenu = false;
let selectedDish = null;
let currentImageIndex = 0;
let orig_icon_width = 40;
let orig_icon_height = 40;

let is_clicked_restoran = false
let clicked_restoran = null


let menuOpen = false;

function draw_logo(rest){
   let resoran_img = null
   let rest_width = rest.width
   let rest_height = rest.height
   let offsetX = rest.x - rest.width/2
   let offsetY = rest.y - rest.height/2
   if (rest.is_selected){
	   resoran_img = resoran_selected
	   rest_width = rest.widthSelected
	   rest_height = rest.heightSelected
	   offsetY = rest.y - rest_height
   }
   else if (rest.is_covered){
	   resoran_img = resoran_active
   }
   else{
	   resoran_img = resoran_inactive
   }
   ctx.save();
   ctx.translate(x, y);
   ctx.scale(scale, scale)
   ctx.drawImage(resoran_img, offsetX,  offsetY, rest_width, rest_height);
   ctx.restore();
}

function drawMap() {
	selectedTown.town_restorans.forEach(rest => {
		resoran_inactive.onload = () => {
			draw_logo(rest)
		};
		if (resoran_inactive.complete) {
			draw_logo(rest)
		}
	});
}



function updateRestaurantInfo() {
    const infoBlock = document.querySelector(".info");
    infoBlock.innerHTML = `
        <div class="info-text">
            <h3>${selectedRestaurant.name}</h3>
            <p><strong>Адрес:</strong> ${selectedRestaurant.address}</p>
            <p><strong>Телефон:</strong> ${selectedRestaurant.phone}</p>
            <p><strong>Часы работы:</strong> ${selectedRestaurant.hours}</p>
            
			<div class="carousel-container">
				<button class="carousel-btn left-btn">&lt;</button>
				<div class="carousel">
				</div>
				<button class="carousel-btn right-btn">&gt;</button>
			</div>
            
            <div class="menu-preview">
                <img src="${selectedRestaurant.menuImage}" id="menuButton" class="menu-image">
                <p><em>Нажмите, чтобы открыть меню</em></p>
            </div>
        </div>
    `;

	function loadCarousel() {
		const carousel = document.querySelector(".carousel");
		carousel.innerHTML = ""; // Очистка старых изображений

		// Создаем картинки
		selectedRestaurant.images.forEach((src, i) => {
			const img = document.createElement("img");
			img.src = src;
			img.classList.add("carousel-image");
			carousel.appendChild(img);
		});

		// Обновляем ссылки на картинки
		images = document.querySelectorAll(".carousel-image");
		order = selectedRestaurant.images.map((_, i) => i);

		updateCarousel();
	}

	// Логика смены фото
	function updateCarousel() {
		if (!images.length) return;

		images.forEach(img => img.classList.remove("center", "side", "left", "right", "hidden"));

		if (images.length === 1) {
			// Только одна фотография — центр
			images[0].classList.add("center");
			return;
		}

		if (images.length === 2) {
			// Две фотографии — левая и центральная
			images[order[0]].classList.add("side", "left");
			images[order[1]].classList.add("center");
			return;
		}

		// Три и более — классическая расстановка
		images[order[0]].classList.add("side", "left");
		images[order[1]].classList.add("center");
		images[order[2]].classList.add("side", "right");

		// Остальные прячем (если 4+)
		for (let i = 3; i < images.length; i++) {
			images[order[i]].classList.add("hidden");
		}
	}

	// Слушатели стрелок
	document.querySelector(".right-btn").addEventListener("click", () => {
		if (images.length <= 1) return;
		order.unshift(order.pop());
		updateCarousel();
	});

	document.querySelector(".left-btn").addEventListener("click", () => {
		if (images.length <= 1) return;
		order.push(order.shift());
		updateCarousel();
	})


    document.getElementById("menuButton").addEventListener("click", () => {
		showMenu = true;
		curr_map = 3        
		draw();
    });
	
    loadCarousel();
}


canvas.addEventListener("click", (event) => {
	if(curr_map == 2){
		const { offsetX, offsetY } = event;
		ctx.save();
		ctx.translate(x, y);
		ctx.scale(scale ,scale )
		let rest = selectedTown.town_restorans
		for (let i=0; i<rest.length; i++){
			ctx.translate(rest[i].x - rest[i].width/2, rest[i].y - rest[i].height/2);
			ctx.scale(rest[i].width/orig_icon_width ,rest[i].height/orig_icon_height);
			is_clicked_restoran = ctx.isPointInPath(iconPath, offsetX*scale2, offsetY*scale2);
			if (is_clicked_restoran &&  selectedRestaurant != rest[i]){
				if(selectedRestaurant != null){
				selectedRestaurant.is_selected=false
				}
				ctx.restore();
				selectedRestaurant = rest[i];
				selectedRestaurant.is_selected=true
				draw()
				updateRestaurantInfo();
				updateResouranSelectorMenu();
				return;
			}
			ctx.scale(orig_icon_width/rest[i].width ,orig_icon_height/rest[i].height);
			ctx.translate(-rest[i].x, -rest[i].y);
		};
		if (selectedRestaurant != null){
		  selectedRestaurant.is_selected=false
		}
		selectedRestaurant = null
		restaurantSelect.selectedIndex = 0;
		updateInfoBlock()
		draw()
		ctx.restore();
	}
});



function openMenu() {
	if (!selectedRestaurant) return;
	menuOpen = true;
	menuOverlay.classList.add("menu-overlay");
	menuOverlay.innerHTML = `
		<div class='menu-close' onclick='closeMenu()'>Назад</div>
		<canvas id='menuCanvas'></canvas>
	`;
	document.body.appendChild(menuOverlay);
	drawMenu();
}

function closeMenu() {
	menuOpen = false;
	menuOverlay.remove();
}

function drawMenu() {
	
}