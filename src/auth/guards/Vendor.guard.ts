import { Vendor } from "@/vendors/Vendor.Schema";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class VendorGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(Vendor.name) private vendorModel: Model<Vendor>
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user['sub']
    const vendor = await this.vendorModel.findById(userId)
    if (!vendor) return false;
    return Boolean(vendor);
  }
}