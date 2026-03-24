/**
 * 单步指数平滑（推荐）
 * @param prev 上一次平滑值
 * @param current 当前值
 * @param alpha 平滑系数
 */
export function emaStep(
    prev: number,
    current: number,
    alpha: number
): number {
    if (alpha <= 0 || alpha > 1) {
        throw new Error("alpha must be in (0, 1]");
    }

    return alpha * current + (1 - alpha) * prev;
}
