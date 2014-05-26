var testMap = {
	merge: {
		left       : 1,
		right      : 1,
		middleRight: 1,
		middleLeft : 1,
		middle2    : 1,
	},
	remove: {
		// это только удаление для листьев
		leafLeftWithoutMerge    : 1,
		//leafRightWithoutMerge   : 1,
		leftWithMerge       : 1,
		leafRightWithMerge      : 1,
		leafMiddgeMergeRight: 1,
		leafMiddgeMergeLeft: 1,
		
		//забор у правого
		//забор у левого
		
		//удаление для узлов
		nodeWithoutMerge: 1,
		nodeWithMergeChilds: 1,
		nodeMoveFromLeft: 1,
		nodeMoveFromRight: 1,
		nodeMerge1: 1,
		nodeMerge2: 1,
		nodeMergeRoot: 1,
		
		// слияние при удалении от корневого (с уменьшением высоты дерева)
	}
};

var bigTree = {
	keys: ['L', 'X'],
	childs: [
		{
			keys: ['C', 'F', 'I'],
			childs: [
				{keys: ['A', 'B'], childs: []},
				{keys: ['D', 'E'], childs: []},
				{keys: ['G', 'H'], childs: []},
				{keys: ['J', 'K'], childs: []},
			]
		},
		{
			keys: ['O', 'R', 'U'],
			childs: [
				{keys: ['M', 'N'], childs: []},
				{keys: ['P', 'Q'], childs: []},
				{keys: ['S', 'T'], childs: []},
				{keys: ['V', 'W'], childs: []},
			]
		},
		{
			keys: ['a', 'd', 'g'],
			childs: [
				{keys: ['Y', 'Z'], childs: []},
				{keys: ['b', 'c'], childs: []},
				{keys: ['e', 'f'], childs: []},
				{keys: ['h', 'i'], childs: []},
			]
		},
	]
};

// ============== Merge ================================
if (testMap.merge.left) {
	test('забор справа для крайнего левого', function(){
		var testTree = $.extend(true, {}, tree);
		
		testTree.t = 3;
		
		var r1 = {
			keys: ['G', 'M'],
			childs: [
				{keys: ['C'], childs: [] },
				{keys: ['H', 'I', 'K'], childs: []},
				{keys: ['O', 'Q', 'S'], childs: []}
			]
		};
		
		var res1 = {
			keys: ['H', 'M'],
			childs: [
				{keys: ['C', 'G'], childs: []},
				{keys: ['I', 'K'], childs: []},
				{keys: ['O', 'Q', 'S'], childs: []}
			]
		};
		
		testTree.merge(r1, 0);
		deepEqual(r1, res1, 'df');
	});
}

if (testMap.merge.right) {
	test('забор для среднего у правого', function(){
		var testTree = $.extend(true, {}, tree);
		
		testTree.t = 3;
		
		var r1 = {
			keys: ['G', 'M'],
			childs: [
				{keys: ['A', 'B'], childs: []},
				{keys: ['H'], childs: []},
				{keys: ['O', 'Q', 'S'], childs: []}
			]
		};
		
		var res1 = {
			keys: ['G', 'O'],
			childs: [
				{keys: ['A', 'B'], childs: []},
				{keys: ['H', 'M'], childs: []},
				{keys: ['Q', 'S'], childs: []}
			]
		};
		testTree.merge(r1, 1);
		deepEqual(r1, res1, 'df');
	});
}

if (testMap.merge.middleRight) {
	test('забор для крайнего правого', function(){
		var testTree = $.extend(true, {}, tree);
		
		testTree.t = 3;
		
		var r1 = {
			keys: ['G', 'M'],
			childs: [
				{keys: ['A', 'B', 'C'], childs: []},
				{keys: ['H', 'I', 'K'], childs: []},
				{keys: ['S'], childs: []}
			]
		};
		
		var res1 = {
			keys: ['G', 'K'],
			childs: [
				{keys: ['A', 'B', 'C'], childs: []},
				{keys: ['H', 'I'], childs: []},
				{keys: ['M', 'S'], childs: []}
			]
		};
		testTree.merge(r1, 2);
		deepEqual(r1, res1, 'df');
	});
}
if (testMap.merge.middleLeft) {
	test('слияние крайнего левого', function(){
		var testTree = $.extend(true, {}, tree);
		
		testTree.t = 3;
		
		var r1 = {
			keys: ['C', 'F'],
			childs: [
				{keys: ['A'], childs: []},
				{keys: ['D', 'E'], childs: []},
				{keys: ['G', 'H'], childs: []}
			]
		};
		
		var res1 = {
			keys: ['F'],
			childs: [
				{keys: ['A', 'C', 'D', 'E'], childs: []},
				{keys: ['G', 'H'], childs: []}
			]
		};
		testTree.merge(r1, 0);
		deepEqual(r1, res1, 'df');
	});
}

if (testMap.merge.middle) {
	test('слияние среднего', function(){
		var testTree = $.extend(true, {}, tree);
		
		testTree.t = 3;
		
		var r1 = {
			keys: ['C', 'F'],
			childs: [
				{keys: ['A', 'B'], childs: []},
				{keys: ['D'], childs: []},
				{keys: ['G', 'H'], childs: []}
			]
		};
		
		var res1 = {
			keys: ['F'],
			childs: [
				{keys: ['A', 'B', 'C', 'D'], childs: []},
				{keys: ['G', 'H'], childs: []}
			]
		};
		testTree.merge(r1, 1);
		deepEqual(r1, res1, 'df');
	});
}

if (testMap.merge.middle2) {
	test('слияние крайнего правого', function(){
		var testTree = $.extend(true, {}, tree);
		
		testTree.t = 3;
		
		var r1 = {
			keys: ['C', 'F'],
			childs: [
				{keys: ['A', 'B'], childs: []},
				{keys: ['D', 'E'], childs: []},
				{keys: ['G'], childs: []}
			]
		};
		
		var res1 = {
			keys: ['C'],
			childs: [
				{keys: ['A', 'B'], childs: []},
				{keys: ['D', 'E', 'F', 'G'], childs: []}
			]
		};
		testTree.merge(r1, 2);
		deepEqual(r1, res1, 'df');
	});
}
// ============== End Merge =============================

// ============== Remove ================================
if (testMap.remove.leafLeftWithoutMerge) {
	test('забор справа для крайнего левого', function(){
		var testTree = $.extend(true, {}, tree);
		
		testTree.t = 3;
		
		var r1 = {
			keys: ['G', 'M'],
			childs: [
				{keys: ['A', 'B', 'C'], childs: [] },
				{keys: ['H', 'I', 'K'], childs: []},
				{keys: ['O', 'Q', 'S'], childs: []}
			]
		};
		
		var res1 = {
			keys: ['G', 'M'],
			childs: [
				{keys: ['A', 'B'], childs: []},
				{keys: ['H', 'I', 'K'], childs: []},
				{keys: ['O', 'Q', 'S'], childs: []}
			]
		};
		
		testTree.root = r1;
		testTree.remove('C');
		deepEqual(r1, res1, 'df');
	});
}

if (testMap.remove.leafRightWithMerge) {
	test('Удаление из крайнего правого листа со слиянием', function() {
		var testTree = $.extend(true, {}, tree);
		
		testTree.t = 3;
		
		var r1 = $.extend(true, {}, bigTree);
		
		var res1 = $.extend(true, {}, r1);
		res1.childs[2] = {
			keys: ['a', 'd'],
			childs: [
				{keys: ['Y', 'Z'], childs: []},
				{keys: ['b', 'c'], childs: []},
				{keys: ['e', 'f', 'g', 'i'], childs: []},
			]
		};
		
		testTree.root = r1;
		testTree.remove('h');
		deepEqual(r1, res1, 'df');
	});
}

if (testMap.remove.leftWithMerge) {
	test('Удаление из крайнего левого листа со слиянием', function() {
		var testTree = $.extend(true, {}, tree);
		
		testTree.t = 3;
		
		var r1 = $.extend(true, {}, bigTree);
		
		var res1 = $.extend(true, {}, r1);
		res1.childs[2] = {
			keys: ['d', 'g'],
			childs: [
				{keys: ['Y', 'a', 'b', 'c'], childs: []},
				{keys: ['e', 'f'], childs: []},
				{keys: ['h', 'i'], childs: []},
			]
		};
		
		testTree.root = r1;
		testTree.remove('Z');
		deepEqual(r1, res1, 'df');
	});
}

if (testMap.remove.leafMiddgeMergeLeft) {
	test('Удаление из крайнего левого листа со слиянием', function() {
		var testTree = $.extend(true, {}, tree);
		
		testTree.t = 3;
		
		var r1 = $.extend(true, {}, bigTree);
		
		var res1 = $.extend(true, {}, r1);
		res1.childs[2] = {
			keys: ['d', 'g'],
			childs: [
				{keys: ['Y', 'Z', 'a', 'c'], childs: []},
				{keys: ['e', 'f'], childs: []},
				{keys: ['h', 'i'], childs: []},
			]
		};
		
		testTree.root = r1;
		testTree.remove('b');
		deepEqual(r1, res1, 'df');
	});
}

//if (testMap.remove.leafMiddgeMergeLeft) {
//	test('Удаление из крайнего левого листа со слиянием', function() {
//		var testTree = $.extend(true, {}, tree);
//		
//		testTree.t = 3;
//		
//		var r1 = $.extend(true, {}, bigTree);
//		
//		var res1 = $.extend(true, {}, r1);
//		res1.childs[2] = {
//			keys: ['d', 'g'],
//			childs: [
//				{keys: ['Y', 'Z', 'a', 'c'], childs: []},
//				{keys: ['e', 'f'], childs: []},
//				{keys: ['h', 'i'], childs: []},
//			]
//		};
//		
//		testTree.root = r1;
//		testTree.remove('b');
//		deepEqual(r1, res1, 'df');
//	});
//}

// Удаление из узла - именно это у меня и не работало в некоторых случаях

if (testMap.remove.nodeWithoutMerge) {
	test('Удаление из ноды без слияния', function() {
		var testTree = $.extend(true, {}, tree);
		
		testTree.t = 3;
		
		var r1 = $.extend(true, {}, bigTree);
		r1.childs[2] = {
			keys: ['b', 'e', 'h'],
			childs: [
				{keys:['Y', 'Z', 'a'], childs: []},
				{keys:['c', 'd'], childs: []},
				{keys:['f', 'g'], childs: []},
				{keys:['i', 'j'], childs: []},
			]
		};
		
		var res1 = $.extend(true, {}, r1);
		res1.childs[2] = {
			keys: ['a', 'e', 'h'],
			childs: [
				{keys: ['Y', 'Z',], childs: []},
				{keys:['c', 'd'], childs: []},
				{keys:['f', 'g'], childs: []},
				{keys:['i', 'j'], childs: []},
			]
		};
		
		testTree.root = r1;
		testTree.remove('b');
		deepEqual(r1, res1, 'df');
	});
}

if (testMap.remove.nodeWithMergeChilds) {
	test('Удаление из ноды + слияние дочерних', function() {
		var testTree = $.extend(true, {}, tree);
		
		testTree.t = 3;
		
		var r1 = $.extend(true, {}, bigTree);
		
		var res1 = $.extend(true, {}, r1);
		res1.childs[2] = {
			keys: ['d', 'g'],
			childs: [
				{keys: ['Y', 'Z', 'b', 'c'], childs: []},
				{keys:['e', 'f'], childs: []},
				{keys:['h', 'i'], childs: []},
			]
		};
		
		testTree.root = r1;
		testTree.remove('a');
		deepEqual(r1, res1, 'df');
	});
}

if (testMap.remove.nodeMoveFromLeft) {
	test('Удаление из ноды + слияние', function() {
		var testTree = $.extend(true, {}, tree);
		
		testTree.t = 3;
		
		var r1 = $.extend(true, {}, bigTree);
		r1.childs[2] = {
			keys: ['a', 'd'],
			childs: [
				{keys: ['Y', 'Z'], childs: []},
				{keys: ['b', 'c'], childs: []},
				{keys: ['e', 'f'], childs: []},
			]
		};
		
		var res1 = $.extend(true, {}, r1);
		res1.keys = ['L', 'U'];
		res1.childs[1].keys.pop();
		res1.childs[1].childs.pop();
		res1.childs[2] = {
			keys: ['X', 'd'],
			childs: [
				{keys:['V', 'W'], childs: []},
				{keys: ['Y', 'Z', 'b', 'c'], childs: []},
				{keys:['e', 'f'], childs: []},
			]
		};
		
		testTree.root = r1;
		testTree.remove('a');
		deepEqual(r1, res1, 'df');
	});
}

if (testMap.remove.nodeMoveFromRight) {
	test('Удаление из ноды + слияние', function() {
		var testTree = $.extend(true, {}, tree);
		
		testTree.t = 3;
		
		var r1 = $.extend(true, {}, bigTree);
		r1.childs[0] = {
			keys: ['C', 'F'],
			childs: [
				{keys: ['A', 'B'], childs: []},
				{keys: ['D', 'E'], childs: []},
				{keys: ['G', 'H'], childs: []},
			]
		};
		
		var res1 = $.extend(true, {}, r1);
		res1.keys = ['O', 'X'];
		res1.childs[1].keys.shift();
		res1.childs[1].childs.shift();
		res1.childs[0] = {
			keys: ['F', 'L'],
			childs: [
				{keys:['A', 'B', 'D', 'E'], childs: []},
				{keys: ['G', 'H',], childs: []},
				{keys:['M', 'N'], childs: []},
			]
		};
		
		testTree.root = r1;
		testTree.remove('C');
		deepEqual(r1, res1, 'df');
	});
}

if (testMap.remove.nodeMerge1) {
	test('Удаление из ноды + слияние', function() {
		var testTree = $.extend(true, {}, tree);
		
		testTree.t = 3;
		
		var r1 = {
			keys: ['L', 'X'],
			childs: [
				{
					keys: ['C', 'F'],
					childs: [
						{keys: ['A', 'B'], childs: []},
						{keys: ['D', 'E'], childs: []},
						{keys: ['G', 'H'], childs: []},
					]
				},
				{
					keys: ['O', 'R'],
					childs: [
						{keys: ['M', 'N'], childs: []},
						{keys: ['P', 'Q'], childs: []},
						{keys: ['S', 'T'], childs: []},
					]
				},
				{
					keys: ['a', 'd'],
					childs: [
						{keys: ['Y', 'Z'], childs: []},
						{keys: ['b', 'c'], childs: []},
						{keys: ['e', 'f'], childs: []},
					]
				}
			]
		};
		
		var res1 = $.extend(true, {}, r1);
		res1.keys = ['X'];
		res1.childs.remove(1);
		res1.childs[0] = {
			keys: ['C', 'L', 'O', 'R'],
			childs: [
				{keys:['A', 'B'], childs: []},
				{keys: ['D', 'E', 'G', 'H'], childs: []},
				{keys:['M', 'N'], childs: []},
				{keys:['P', 'Q'], childs: []},
				{keys:['S', 'T'], childs: []},
			]
		};
		
		testTree.root = r1;
		testTree.remove('F');
		deepEqual(r1, res1, 'df');
	});
}

if (testMap.remove.nodeMerge2) {
	test('Удаление из ноды + слияние', function() {
		var testTree = $.extend(true, {}, tree);
		
		testTree.t = 3;
		
		var r1 = {
			keys: ['L', 'X'],
			childs: [
				{
					keys: ['C', 'F'],
					childs: [
						{keys: ['A', 'B'], childs: []},
						{keys: ['D', 'E'], childs: []},
						{keys: ['G', 'H'], childs: []},
					]
				},
				{
					keys: ['O', 'R'],
					childs: [
						{keys: ['M', 'N'], childs: []},
						{keys: ['P', 'Q'], childs: []},
						{keys: ['S', 'T'], childs: []},
					]
				},
				{
					keys: ['a', 'd'],
					childs: [
						{keys: ['Y', 'Z'], childs: []},
						{keys: ['b', 'c'], childs: []},
						{keys: ['e', 'f'], childs: []},
					]
				}
			]
		};
		
		var res1 = $.extend(true, {}, r1);
		res1.keys = ['L'];
		res1.childs.remove(1);
		res1.childs[1] = {
			keys: ['O', 'R', 'X', 'd'],
			childs: [
				{keys:['M', 'N'], childs: []},
				{keys: ['P', 'Q'], childs: []},
				{keys:['S', 'T'], childs: []},
				{keys:['Y', 'Z', 'b', 'c'], childs: []},
				{keys:['e', 'f'], childs: []},
			]
		};
		
		testTree.root = r1;
		testTree.remove('a');
		deepEqual(r1, res1, 'df');
	});
}

if (testMap.remove.nodeMergeRoot) {
	test('Удаление из ноды + слияние', function() {
		var testTree = $.extend(true, {}, tree);
		
		testTree.t = 3;
		
		var r1 = {
			keys: ['L'],
			childs: [
				{keys: ['C', 'F'], childs: []},
				{keys: ['O', 'R'], childs: []},
			]
		};
		
		var res1 = {
			keys: ['C', 'L', 'O', 'R'],
			childs: []
		};
		
		testTree.root = r1;
		testTree.remove('F');
		deepEqual(testTree.root, res1, 'df');
	});
}
// ============== End Remove ============================