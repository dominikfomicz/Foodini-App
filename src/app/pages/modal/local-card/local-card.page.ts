import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, LoadingController, Platform } from '@ionic/angular';
import { ConnectionService } from 'src/app/services/connection.service';
import { ImagePage } from '../image/image.page';

@Component({
	selector: 'app-local-card',
	templateUrl: './local-card.page.html',
	styleUrls: ['./local-card.page.scss'],
})
export class LocalCardPage implements OnInit {

	id_local_data_main;
	items: any;
	favColor: any;
	show = false;
	showTags = false;
	coupons_button = true;

	constructor(private modalCtrl: ModalController,
		public navCtrl: NavController,
		public loadingCtrl: LoadingController,
		public connection: ConnectionService,
		public platform: Platform) {
	}

	ngOnInit() {
		this.presentLoading().then(a =>
			this.connection.getDataByGet('locals/getDetails/' + this.id_local_data_main).subscribe(data => {
				this.items = data;
				console.log(data);
				if (this.items.is_favouirite === true) {
					this.favColor = '/assets/img/star_color.svg';
				} else {
					this.favColor = '/assets/img/star.svg';
				}

				if (this.items.coupons_count === 0) {
					this.coupons_button = false;
				}
				this.platform.ready().then(a => {
					this.loadingCtrl.dismiss('loading');
					this.show = true;
				});
			})
		);
	}

	closeModal() {
		this.modalCtrl.dismiss();
	}

	changeFavColor(id_local_data_main) {
		if (this.favColor === '/assets/img/star.svg') {
			this.favColor = '/assets/img/star_color.svg';
			this.items.favourite_count = this.items.favourite_count + 1;
			this.connection.getDataByPost('locals/addLocalToFavourite', { id_local_data_main: id_local_data_main }).subscribe(data => {
				console.log(data);
			});
		} else {
			this.favColor = '/assets/img/star.svg';
			this.items.favourite_count = this.items.favourite_count - 1;
			this.connection.getDataByPost('locals/removeLocalFromFavourite', { id_local_data_main: id_local_data_main }).subscribe(data => {
				console.log(data);
			});
		}
	}

	openCouponList(id_local_data_main, local_name, phone_number) {
		this.navCtrl.navigateForward('local-coupons-card/' + id_local_data_main + '/' + local_name + '/' + phone_number);
		this.closeModal();
	}

	async presentLoading() {
		const loading = await this.loadingCtrl.create({
			message: 'Ładowanie',
		});
		await loading.present();
	}

	expandTags() {
		this.showTags = !this.showTags;
	}

	openFacebook(link) {
		this.countStats('Facebook').then(a => {
			window.open(link, '_self');
		});
	}

	openInstagram(link) {
		this.countStats('Instagram').then(a => {
			window.open(link, '_self');
		});
	}


	openPhone(phone_number) {
		this.countStats('Phonenumber').then(a => {
			window.open('tel:' + phone_number, '_self');
		});
	}

	openOrder(order_url) {
		this.countStats('Order').then(a => {
			window.open(order_url, '_self');
		});
	}

	async countStats(name) {
		this.connection.getDataByPost('locals/show' + name + 'Count', { id_local_data_main: this.id_local_data_main }).subscribe(data => {
		});
	}

	async showMenu() {
		this.countStats('Menu');
		const modal = await this.modalCtrl.create({
			component: ImagePage,
			componentProps: {
				id_local_data_main: this.id_local_data_main
			}
		});
		return await modal.present();
	}
}
