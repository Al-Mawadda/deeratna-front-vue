<template>
    <div class="MField" :id="Name">
        <input type="text" disabled v-model="RFIDInput" required />
        <label>{{ Label }}</label>
        <div class="MFieldBG"></div>
        <div class="RFIDBTN" id="RFIDClearBTN" @click="Clear" v-show="RFIDInput != '' && Clearable">
            <svg viewBox="0 0 1000 1000">
                <path d="M922.1,147.7c0.5,14.9-10.1,31.1-24.9,45.8C800.4,290,703.8,386.8,607.1,483.5c-16.5,16.5-16.5,16.5,0.5,33.4
		c97,97,194,194.1,291.1,291c17.4,17.3,27.2,36.8,22.7,61.9c-8.5,47.1-63.2,68.5-101.3,39.4c-5.5-4.2-10.5-9.3-15.4-14.2
		c-97.8-97.7-195.6-195.3-293-293.4c-9.4-9.5-14-9.2-23.2,0.1C389.7,701.1,290.3,800,191.3,899.3c-19.7,19.8-42.3,28.4-69.5,20
		c-41.1-12.7-57.5-63.1-32.2-97.9c4.1-5.6,9.2-10.6,14.1-15.5c97.3-97.4,194.7-194.8,292.1-292.2c13.8-13.8,13.8-13.8-0.5-28.1
		C297.3,387.5,199.3,289.3,101,191.4c-20.2-20.1-29.1-43-19.9-70.8c15-45.2,70.8-57.9,106.2-23.7c33.9,32.7,66.7,66.4,100,99.7
		c67.3,67.3,134.7,134.4,201.6,202c8.7,8.8,13.2,9.2,22.1,0.2c98.9-99.4,198.4-198.2,297.5-297.4c13.6-13.7,28.8-23,48.6-23.3
		C893.3,77.6,921.6,104.9,922.1,147.7z" />
            </svg>
        </div>
        <div class="MButton RFIDBTN" v-show="!Disabled" @click="Read" @contextmenu.prevent="SelectDevice" :disabled="IsBusy">
            <svg viewBox="0 0 1000 1000">
                <path
                    d="M365.27,904.18H185.64c-24.7,0-45.84-8.79-63.43-26.38s-26.38-38.73-26.38-63.43V185.64c0-24.7,8.79-45.84,26.38-63.43
	s38.73-26.38,63.43-26.38h179.64v89.82H185.64v628.73h179.64V904.18z M455.09,994V6h89.82v988H455.09z M634.73,904.18v-89.82h89.82
	v89.82H634.73z M634.73,185.64V95.82h89.82v89.82H634.73z M814.36,904.18v-89.82h89.82c0,24.7-8.79,45.84-26.38,63.43
	S839.06,904.18,814.36,904.18z M814.36,724.55v-89.82h89.82v89.82H814.36z M814.36,544.91v-89.82h89.82v89.82H814.36z
	 M814.36,365.27v-89.82h89.82v89.82H814.36z M814.36,185.64V95.82c24.7,0,45.84,8.79,63.43,26.38s26.38,38.73,26.38,63.43H814.36z" />
            </svg>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    props: {
        Name: { type: String, required: true },
        Label: { type: String, required: true },
        Disabled: { type: Boolean, default: false },
        Clearable: { type: Boolean, default: false },
    },
    data() {
        return {
            RFIDInput: ref(''),
            TheDevice: ref(null),
            IsBusy: ref(false),
            BAUD: ref(57600),
            POWER: ref([0x2F, 0]),
            SCAN: ref([0x25, 15]),
        };
    },
    mounted() {
        this.Reconnect();
    },
    methods: {
        async Read() {
            this.IsBusy = true;
            if (!this.TheDevice) {
                console.log('الجهاز غير موجود');
                this.IsBusy = false;
                return;
            }

            this.RFIDInput = ''
            let rd, wr, rx = new Uint8Array()
            try {

                if (!this.TheDevice.connected) {
                    this.Reconnect()
                }

                if (!this.TheDevice.connected) {
                    console.log('الجهاز غير موجود');
                    this.IsBusy = false;

                    return;
                }

                await this.TheDevice.open({ baudRate: this.BAUD })
                try { await this.TheDevice.setSignals?.({ dataTerminalReady: true, requestToSend: true }) } catch { /**/ }
                await this.wait(60)

                wr = this.TheDevice.writable.getWriter(); rd = this.TheDevice.readable.getReader()

                // flush any stale byte
                await Promise.race([rd.read(), this.wait(40)]).catch(() => { })


                // same sequence that worked
                await wr.write(this.MakeCommand(this.POWER)); await this.wait(20)
                await wr.write(this.MakeCommand(this.SCAN)); await this.wait(20)
                await wr.write(this.MakeCommand(0x01))

                const end = Date.now() + 1800
                while (Date.now() < end && !this.RFIDInput) {
                    const { value } = await Promise.race([rd.read(), this.wait(80).then(() => ({ value: null }))])
                    if (!value) continue
                    rx = this.cat(rx, value)
                    let hit
                    while ((hit = this.ParseFrame(rx))) {
                        rx = rx.slice(hit.end)
                        const f = hit.seg, cmd = f[2], status = f[3]
                        if (status === 0xFD || status === 0xFE) continue
                        if (cmd !== 0x01) continue

                        const data = this.hex(f.slice(4, f.length - 2))
                        if (data == '') {
                            this.RFIDInput = '';
                        } else {
                            this.RFIDInput = parseInt(data.slice(-6), 16);
                        }
                    }
                }
            } finally {
                try { rd?.cancel() } catch { /**/ }
                try { rd?.releaseLock() } catch { /**/ }
                try { wr?.releaseLock() } catch { /**/ }
                if (this.TheDevice.connected) {
                    try { this.TheDevice?.close() } catch { /**/ }
                }
                setTimeout(() => {
                    this.IsBusy = false;
                }, 500);

            }
        },
        async SelectDevice() {
            const p = await navigator.serial.requestPort()
            if (!p) return
            this.TheDevice = p
            localStorage.setItem('UHFDevice', JSON.stringify(p.getInfo()))
        },
        async Reconnect() {
            const saved = JSON.parse(localStorage.getItem('UHFDevice') || '{}')
            const ports = await navigator.serial.getPorts()
            const match = ports.find(p => {
                const info = p.getInfo()
                return info.usbVendorId === saved.usbVendorId &&
                    info.usbProductId === saved.usbProductId
            })
            if (match) {
                this.TheDevice = match
            } else {
                this.TheDevice = null;
            }
        },
        CalculateCRC(bytes) {
            let crc = 0xFFFF              // start value
            for (let i = 0; i < bytes.length; i++) {
                crc ^= bytes[i]             // XOR byte into CRC

                for (let bit = 0; bit < 8; bit++) {
                    const lsb = crc & 1       // check least-significant bit
                    crc >>= 1                 // shift right by 1
                    if (lsb) crc ^= 0x8408    // apply polynomial if bit was 1
                }
            }
            return crc & 0xFFFF           // return 16-bit result        },
        },
        MakeCommand(cmd, data = []) {
            const length = 4 + data.length
            const address = 0xFF
            const head = new Uint8Array([length, address, cmd, ...data])
            const crc = this.CalculateCRC(head)

            return new Uint8Array([
                ...head,
                crc & 0xFF,       // CRC low byte
                (crc >>> 8) & 0xFF // CRC high byte
            ])
        },
        ParseFrame(buffer) {
            for (let i = 0; i <= buffer.length - 6; i++) {
                const L = buffer[i]
                for (const len of [L, L + 1]) {
                    const j = i + len; if (len < 6 || j > buffer.length) continue
                    const seg = buffer.slice(i, j), body = seg.slice(0, seg.length - 2)
                    const got = seg[seg.length - 2] | (seg[seg.length - 1] << 8)
                    if (got === this.CalculateCRC(body)) return { seg, end: j }
                }
            }
            return null
        },
        Get() {
            return this.RFIDInput;
        },
        Set(Value) {
            this.RFIDInput = Value;
        },
        Clear() {
            this.RFIDInput = '';
        },
        wait(ms) {
            return new Promise(r => setTimeout(r, ms));
        },
        hex(u) {
            return Array.from(u, b => b.toString(16).padStart(2, "0"))
                .join("")
                .toUpperCase();
        },
        cat(a, b) {
            const u = new Uint8Array(a.length + b.length);
            u.set(a);
            u.set(b, a.length);
            return u;
        },
    }
};
</script>

<style scoped>
.MField {
    display: flex;
    flex-wrap: wrap;
}

.MField input {
    flex: 1;
}

.RFIDBTN {
    position: relative;
    width: 28px;
    height: 28px;
    padding: 0;
    margin: 5px 7px 4px 7px;
    justify-content: center;
    align-items: center;
}

.RFIDBTN svg {
    display: flex;
    width: 60%;
    height: 60%;
}

#RFIDClearBTN {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 18px;
    height: 18px;
    margin: 0;
    padding: 0;
    cursor: pointer;
}

#RFIDClearBTN svg {
    width: 80%;
    height: 80%;
    fill: #999;
}
</style>
