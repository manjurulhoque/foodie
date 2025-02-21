"use client";

import { useCreateAddressMutation } from "@/store/reducers/address/api";
import { AddressForm } from "../components/address-form";

export default function NewAddressPage() {
    const [createAddress, { isLoading }] = useCreateAddressMutation();

    const onSubmit = async (data: any) => {
        await createAddress(data).unwrap();
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">
                    New Address
                </h2>
            </div>
            <AddressForm onSubmit={onSubmit} isLoading={isLoading} />
        </div>
    );
}
