"use client";

import { useParams } from "next/navigation";
import {
    useGetAddressesQuery,
    useUpdateAddressMutation,
} from "@/store/reducers/address/api";
import { AddressForm } from "../../components/address-form";

export default function EditAddressPage() {
    const params = useParams();
    const addressId = Number(params.addressId);

    const { data: addressesData } = useGetAddressesQuery();
    const [updateAddress, { isLoading }] = useUpdateAddressMutation();

    const address = addressesData?.data?.find((a) => a.id === addressId);

    const onSubmit = async (data: any) => {
        await updateAddress({ id: addressId, address: data }).unwrap();
    };

    if (!address) return null;

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">
                    Edit Address
                </h2>
            </div>
            <AddressForm
                initialData={address}
                onSubmit={onSubmit}
                isLoading={isLoading}
            />
        </div>
    );
}
