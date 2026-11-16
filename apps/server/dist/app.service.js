"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const monnify_service_1 = require("./common/services/monnify/monnify.service");
const shared_1 = require("@spike/shared");
let AppService = class AppService {
    monnifyService;
    constructor(monnifyService) {
        this.monnifyService = monnifyService;
    }
    async getHello() {
        return await this.monnifyService.login();
    }
    async getBanks() {
        const data = await this.monnifyService.getBanks();
        console.log(data);
        return new shared_1.ServerResponse({
            status: 200,
            data,
            message: 'Monnify Banks'
        });
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [monnify_service_1.MonnifyService])
], AppService);
//# sourceMappingURL=app.service.js.map