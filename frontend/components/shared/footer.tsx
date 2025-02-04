import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export default function Footer() {
    return (
        <footer className="bg-gray-100">
            <Container>
                <div className="w-full  bg-hero/30 grid grid-cols-2 md:grid-cols-4 px-4 md:px-12 py-8">
                    <div className="flex flex-col items-start justify-start gap-3">
                <h2 className="text-3xl font-semibold">Navigation</h2>
                <p className="text-neutral-500 text-sm">Homepage</p>
                <p className="text-neutral-500 text-sm">
                    Our Benefits
                </p>
                <p className="text-neutral-500 text-sm">
                    Featured Menu
                </p>
                <p className="text-neutral-500 text-sm">
                    Classic Dishes
                </p>
                <p className="text-neutral-500 text-sm">
                    Meet Our Chefs
                </p>
            </div>

            <div className="flex flex-col items-start justify-start gap-3">
                <h2 className="text-3xl font-semibold">Support</h2>
                <p className="text-neutral-500 text-sm">Privacy Policy</p>
                <p className="text-neutral-500 text-sm">
                    Terms of Service
                </p>
                <p className="text-neutral-500 text-sm">Guidelines</p>
            </div>

            <div className="flex flex-col items-start justify-start gap-3">
                <h2 className="text-3xl font-semibold">Get in Touch</h2>
                <p className="text-neutral-500 text-sm">
                    +1 (555) 123-4567
                </p>
                <p className="text-neutral-500 text-sm">
                    contact@foodie.com
                </p>
                <p className="text-neutral-500 text-sm">
                    123 Main Street, New York, USA
                </p>
            </div>

            <div className="flex flex-col items-start justify-start gap-3">
                <h2 className="text-3xl font-semibold">
                    Join Our Newsletter
                </h2>
                <div className="w-full rounded-md border-2 border-emerald-500 flex items-center justify-center">
                    <input
                        type="text"
                        placeholder="Your Email Address"
                        className="h-full bg-transparent pl-4 text-sm text-neutral-500 w-full outline-none border-none"
                    />
                    <Button className="bg-emerald-500 rounded-tr-none rounded-br-none hover:bg-emerald-600">
                        Sign Up
                    </Button>
                </div>
            </div>
        </div>
        <div className="mx-auto py-8 ">
            <p className="text-center text-xs text-black">
                &copy; 2024 Foodie. All rights reserved.
                    </p>
                </div>
            </Container>
        </footer>
    );
}
