# K-Cover 算法应用

这是一个基于Next.js的K-Cover算法交互式应用，旨在解决最小覆盖问题。

## 功能特点

- **双模式计算**：提供速度模式（贪心算法）和精确模式（组合优化）
- **参数化算法**：支持通过UI配置所有算法参数
- **结果可视化**：清晰展示计算结果
- **结果管理**：支持执行、删除和保存结果
- **数据持久化**：自动保存历史计算结果
- **结果导出**：支持导出结果为文本文件
- **响应式设计**：适配不同设备屏幕大小

## 参数说明

系统接受以下参数：

- **m (Total Sample Size)**: 样本总量，范围为10-100
- **n (Random Selection Size)**: 从m个样本中随机选择的样本数量，必须小于或等于m
- **k (Output Group Size)**: 输出组的大小，必须小于或等于m
- **j (Subset Size)**: 需要覆盖的子集大小，必须小于或等于k
- **s (Intersection Threshold)**: 交集阈值，必须小于或等于j
- **Min. s-Samples Required**: 最少需要的s样本数量，必须大于等于1

## 操作按钮

应用提供了三个主要操作按钮：

1. **Execute**：执行算法计算并显示结果
2. **Delete**：清除当前显示的结果
3. **Store**：将当前结果保存到数据库中

计算结果会生成一个格式为"m-n-k-j-s-x-y"的唯一标识符，用于结果管理和识别。

## 开发技术

- **前端框架**：Next.js 14
- **UI组件**：TailwindCSS、HeadlessUI
- **状态管理**：React Hooks
- **算法实现**：TypeScript
- **数据存储**：浏览器localStorage

## 运行项目

```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建项目
npm run build

# 生产模式运行
npm start
```

## 文件结构

```
kcover-app/
├── src/
│   ├── app/              # 页面路由
│   ├── components/       # UI组件
│   │   └── algorithm/    # 算法相关组件
│   └── lib/              # 算法核心实现
├── public/               # 静态资源
└── package.json          # 项目依赖
```

## 算法说明

K-Cover算法是一种用于解决最小集合覆盖问题的算法，特别适用于样本选择场景。详细算法实现可参考`src/lib/algorithm-core.ts`文件。

## 许可证

MIT
