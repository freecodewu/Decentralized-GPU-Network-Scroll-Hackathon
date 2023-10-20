export type InstanceResponse = InstanceInfoResponse[]

export interface InstanceInfoResponse {
    apiVersion: string,
    host: string
    machine_id:string
    market_id: number
    owner: string
    port: string
    price: Price
    server_info: InstanceInfo
    status: string
}

export interface InstanceInfo {
    market_id: number;
    machine_id: string;
    cpu: Cpu;
    disk: Disk;
    gpu: Gpu;
    guid: string;
    health: Health;
    motherboard: Motherboard;
    network: Network;
    /**
     * address
     */
    owner: string;
    price: Price;
    ram: Ram;
    server_info: ServerInfo;
}

export interface ServerInfo {
    host_info: HostInfo;
}

export interface HostInfo {
    host: string;
    port: number;
}

export interface Cpu {
    cores: string;
    model: string;
    threads: string;
}

export interface Disk {
    iops: number;
    /**
     * MB/s
     */
    readBandwidth: number;
    /**
     * GB
     */
    size: string;
    /**
     * nvme;sata
     */
    type: string;
    /**
     * MB/s
     */
    writeBandwidth: number;
}

export interface Gpu {
    count: number;
    maxCUDAVersion: string;
    model: string;
    /**
     * GB
     */
    ram: number;
    /**
     * GB/s
     */
    ramBandwidth: number;
    tflops: number;
}

export interface Health {
    /**
     * %
     */
    reliability: number;
    /**
     * UnixTimestamp
     */
    scheduledMaintenanceTimestamp: number;
}

export interface Motherboard {
    model: string;
    /**
     * GB/s
     */
    pcieBandwidth: number;
    pcieLanes: number;
    pcieVersion: string;
}

export interface Network {
    /**
     * Mbps
     */
    downBandwidth: number;
    ports: number;
    /**
     * Mbps
     */
    upBandwidth: number;
}

/**
 * Price
 */
export interface Price {
    /**
     * $/hr
     */
    downband_width: number;
    /**
     * $/hr
     */
    server_price: number;
    /**
     * $/
     */
    storage_price: number;
    /**
     * $/hr
     */
    upband_width: number;
}

export interface Ram {
    /**
     * Mhz
     */
    frequency: number;
    /**
     * GB
     */
    size: number;
}
