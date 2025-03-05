"use client";

import { useEffect } from "react";

interface ClientLoggerProps {
    data: any;
    label?: string;
}

export default function ClientLogger({
    data,
    label = "Debug data",
}: ClientLoggerProps) {
    useEffect(() => {
        console.log(label + ":", data);
    }, [data, label]);

    // This component doesn't render anything
    return null;
}
