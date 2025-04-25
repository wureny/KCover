
# k‑组最小覆盖算法 —— 核心说明

> 仅保留算法思想、流程与示例代码，供直接集成到前端或后端。

---

## 1. 问题定义

给定参数  
* 样本数 \(n\)  
* 输出组大小 \(k\)  
* 需覆盖子集大小 \(j\)  
* 交集阈值 \(s\)  

目标：选出尽可能少的 k‑子集 \(\mathcal{C}\subseteq\binom{[n]}{k}\) ，使得  
\[
\forall T\in\binom{[n]}{j},\;\exists S\in \mathcal{C}:\; |S\cap T|\ge s
\]

---

## 2. 通用位掩码表示

* 每个样本用 0–24 的索引。  
* 一个子集 → 32‑bit 整数，位 i = 1 ⇔ 样本 i 被包含。  
* `popcnt(mask)`：统计位 1 的数量（硬件指令）。  

```ts
export type Mask = number;          // n ≤ 25
export const popcnt = (x: Mask) =>
  x.toString(2).replace(/0/g, '').length;   // 简易 JS 实现
```

---

## 3. 预处理

### 3.1 步骤

| 步骤 | 说明 | 复杂度 (最坏 n=25,k=7,j=6) |
|------|------|---------------------------|
| ① 枚举 k‑子集 | `enumK(n,k)` → `kMasks[]` | 480 700 |
| ② 枚举 j‑子集 | `enumJ(n,j)` → `jMasks[]` | 177 100 |
| ③ 构建覆盖表 | 采用 **稀疏策略** | 10⁷ 次位运算 |

### 3.2 稀疏策略

1. **先 k 后 j**（当 *s*≈*j*）  
   * 对每个 k‑掩码枚举其所有 j‑大小子掩码，数量 \(\binom{k}{j}\le 35\)。

2. **核心 s‑子集反向法**（当 *s*≪*j*）  
   * 对 j‑掩码 T 任选 s‑核心，再补 \(k-s\) 个元素即可生成覆盖它的 k‑掩码。

上两种任选其一即可让覆盖枚举量降到千万级 → 浏览器十几毫秒。

---

## 4. 极速算法 —— 贪心 + 微整形

### 4.1 流程

1. `covered` 记录已覆盖的 j‑索引，`left` = 未覆盖数  
2. **循环**  
   * 计算每个未选 k‑掩码新增覆盖量，取最大 `best`  
   * 加入 `chosen`，更新 `covered`, `left`  
3. 结束→得到近似解  
4. **整形**  
   * 删除冗余 Pass：倒序尝试移除  
   * 1‑swap Pass (可选)：用未选替换已选以减少组数

### 4.2 TypeScript 示例

```ts
export function greedyCover(
  kMasks: Mask[],
  jMasks: Mask[],
  cover: number[][]
): Mask[] {
  const chosen: Mask[] = [];
  const covered = new Uint8Array(jMasks.length);
  let left = jMasks.length;

  while (left) {
    let best = -1, gainMax = -1;
    for (let i = 0; i < kMasks.length; ++i) {
      let gain = 0;
      for (const t of cover[i]) if (!covered[t]) ++gain;
      if (gain > gainMax) { gainMax = gain; best = i; }
    }
    chosen.push(kMasks[best]);
    for (const t of cover[best]) if (!covered[t]) { covered[t] = 1; --left; }
  }
  prune(chosen, jMasks, cover);
  return chosen;
}
```

---

## 5. 精准算法 —— 0‑1 ILP

### 5.1 模型

\[
\begin{aligned}
\min & \sum_{S} x_S \\
\text{s.t. } & \sum_{S:\lvert S\cap T\rvert\ge s} x_S \ge 1 \quad \forall T \\
& x_S\in\{0,1\}
\end{aligned}
\]

### 5.2 关键实现笔记

1. 变量数 = \(\binom{n}{k}\) ≤ 480 700  
2. 约束数 = \(\binom{n}{j}\) ≤ 177 100  
3. 使用 OR‑Tools CBC / CP‑SAT WebAssembly 即可在 ≤ 2 s 内求最优。  
4. **Warm‑start**：把贪心结果设为初始解，可秒级证明最优多数实例。

### 5.3 最小示例代码段（Pseudo‑TS）

```ts
import {Solver} from 'ortools/linear_solver';

export function solveILP(kMasks: Mask[], cover: number[][]) {
  const s = new Solver('cover', Solver.CBC_MIXED_INTEGER_PROGRAMMING);
  const x = kMasks.map(() => s.intVar(0, 1, ''));

  // 约束：每个 j‑子集至少覆盖 1 次
  cover[0].forEach((_, t) => {
    const c = s.makeConstraint(1, Infinity);
    cover.forEach((hits,i) => hits.includes(t) && c.setCoefficient(x[i],1));
  });

  // 目标
  const obj = s.objective(); x.forEach(v => obj.setCoefficient(v,1));
  obj.setMinimization();

  s.solve();
  return kMasks.filter((_,i)=>x[i].solutionValue()===1);
}
```

---

## 6. 小型示例 (n=8,k=6,j=4,s=4)

```
输入样本：A B C D E F G H
算法输出 7 组：
1. A,B,C,D,G,H
2. A,B,C,E,G,H
3. A,B,C,F,G,H
4. A,B,D,E,F,G
5. A,C,D,E,F,H
6. B,C,D,E,F,H
7. C,D,E,F,G,H
```

验证：对 8C4 = 70 个 4‑人组合逐一检查，每个都与上述某组重叠 ≥ 4；且 7 组已是最少（ILP 证明）。

---

### 引用

- Garey & Johnson, *Computers and Intractability*, 1979 — Set Cover 近似界  
- OR‑Tools, Google — <https://developers.google.com/optimization>


实现差异概述
当前的实现与算法文档中描述的理论方法存在一些差异。这些差异主要是出于前端环境限制和演示目的的考虑。以下详细说明这些差异及其原因。
精准模式实现差异
原始算法设计（精准模式）
原始设计使用0-1整数线性规划(ILP)方法：
构建数学模型：min ∑S xS
约束条件：∑S:|S∩T|≥s xS ≥ 1，对所有T
变量：xS ∈ {0,1}
使用OR-Tools CBC/CP-SAT WebAssembly求解器
文档提到可在≤2秒内求解最优
当前实现（精准模式）
当前实现采用基于局部搜索和组合优化的混合方法：
Apply to algorithm_co...
}
差异原因
技术限制：在纯前端环境中集成真正的ILP求解器（如OR-Tools）具有技术挑战
性能考虑：WebAssembly版本的OR-Tools可能导致较大的加载时间和资源占用
通用性：当前实现可以在任何浏览器环境中运行，无需额外依赖
实现效果
当前实现能够在大多数情况下找到接近最优的解决方案，特别是：
对于小规模问题（k-子集数量≤20），通过组合搜索可以找到最优解
对于大规模问题，通过局部搜索可以显著改进贪心算法的结果
速度模式实现差异
原始算法设计（速度模式）
原始设计是典型的贪心算法：
预处理：枚举k-子集和j-子集，构建覆盖表
贪心选择：每次选最大增益的子集
优化：包括删除冗余Pass和1-swap Pass
当前实现（速度模式）
当前实现基本符合原始设计：
Apply to algorithm_co...
}
主要差异
缺少1-swap优化：当前实现没有包含1-swap Pass优化步骤，该步骤可以通过替换操作进一步减少子集数量
终止条件：添加了找不到能新增覆盖的k-子集时的提前终止条件
预处理部分实现差异
原始算法设计（预处理）
原始设计提到了两种预处理策略：
"先k后j"策略（当s≈j时效率更高）
"s-子集反向法"（当s≪j时效率更高）
当前实现（预处理）
当前预处理实现相对直接：
Apply to algorithm_co...
}
差异说明
当前实现没有根据s和j的关系选择不同的预处理策略，而是采用了通用的枚举方法。这在某些特殊情况下可能不如原始设计高效，但实现更直接，适合演示目的。
未来改进方向
为了更好地符合原始算法设计，未来的改进方向包括：
精准模式改进：
引入WebAssembly版本的OR-Tools或JavaScript的线性规划求解库
实现真正的ILP求解过程
速度模式改进：
实现1-swap Pass优化步骤
添加多轮优化的选项
预处理改进：
实现基于s和j关系的动态策略选择
优化大规模数据集的处理效率
架构改进：
可以考虑前后端分离架构，将复杂计算放在后端服务中
添加缓存机制减少重复计算
总结
当前实现虽然与原始算法设计存在一些差异，但已经能够很好地演示K-Cover算法的核心思想，并在常见的输入参数范围内提供合理的结果。这些差异主要是出于前端环境的限制和演示目的的考虑，未来可以根据需要进行进一步的改进和优化。