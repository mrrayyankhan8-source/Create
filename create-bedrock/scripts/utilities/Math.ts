/**
 * Mathematical models and utilities.
 */

export class Vector3 {
    constructor(public x: number, public y: number, public z: number) {}

    add(other: Vector3): Vector3 {
        return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    subtract(other: Vector3): Vector3 {
        return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    multiply(scalar: number): Vector3 {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize(): Vector3 {
        const mag = this.magnitude();
        if (mag === 0) return new Vector3(0, 0, 0);
        return new Vector3(this.x / mag, this.y / mag, this.z / mag);
    }

    distanceTo(other: Vector3): number {
        return this.subtract(other).magnitude();
    }
}

export class Quaternion {
    constructor(public x: number, public y: number, public z: number, public w: number) {}

    multiply(q: Quaternion): Quaternion {
        return new Quaternion(
            this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y,
            this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x,
            this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w,
            this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z
        );
    }

    normalize(): Quaternion {
        let n = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z + this.w*this.w);
        if (n === 0) {
            return new Quaternion(0,0,0,1);
        }
        return new Quaternion(this.x/n, this.y/n, this.z/n, this.w/n);
    }
}

export class Matrix4 {
    public elements: Float32Array;

    constructor() {
        this.elements = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    // Create translation matrix
    static makeTranslation(x: number, y: number, z: number): Matrix4 {
        let m = new Matrix4();
        m.elements[12] = x;
        m.elements[13] = y;
        m.elements[14] = z;
        return m;
    }

    // Create rotation matrix from Quaternion
    static makeRotationFromQuaternion(q: Quaternion): Matrix4 {
        let m = new Matrix4();
        const x2 = q.x + q.x;
        const y2 = q.y + q.y;
        const z2 = q.z + q.z;
        const xx = q.x * x2;
        const xy = q.x * y2;
        const xz = q.x * z2;
        const yy = q.y * y2;
        const yz = q.y * z2;
        const zz = q.z * z2;
        const wx = q.w * x2;
        const wy = q.w * y2;
        const wz = q.w * z2;

        m.elements[0] = 1 - (yy + zz);
        m.elements[4] = xy - wz;
        m.elements[8] = xz + wy;

        m.elements[1] = xy + wz;
        m.elements[5] = 1 - (xx + zz);
        m.elements[9] = yz - wx;

        m.elements[2] = xz - wy;
        m.elements[6] = yz + wx;
        m.elements[10] = 1 - (xx + yy);

        return m;
    }

    multiply(b: Matrix4): Matrix4 {
        const ae = this.elements;
        const be = b.elements;
        const te = new Float32Array(16);

        const a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
        const a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
        const a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
        const a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

        const b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
        const b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
        const b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
        const b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];

        te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

        te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

        te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

        te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

        let result = new Matrix4();
        result.elements = te;
        return result;
    }
}

export class Transform {
    public position: Vector3;
    public rotation: Quaternion;
    public scale: Vector3;

    constructor() {
        this.position = new Vector3(0, 0, 0);
        this.rotation = new Quaternion(0, 0, 0, 1);
        this.scale = new Vector3(1, 1, 1);
    }

    getMatrix(): Matrix4 {
        let t = Matrix4.makeTranslation(this.position.x, this.position.y, this.position.z);
        let r = Matrix4.makeRotationFromQuaternion(this.rotation);
        return t.multiply(r); // Scale is ignored for simple rigid bodies for now
    }

    transformPoint(point: Vector3): Vector3 {
        let m = this.getMatrix();
        let e = m.elements;
        let x = point.x, y = point.y, z = point.z;
        let w = e[3]*x + e[7]*y + e[11]*z + e[15];
        return new Vector3(
            (e[0]*x + e[4]*y + e[8]*z + e[12]) / w,
            (e[1]*x + e[5]*y + e[9]*z + e[13]) / w,
            (e[2]*x + e[6]*y + e[10]*z + e[14]) / w
        );
    }
}