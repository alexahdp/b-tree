test('забор справа для крайнего левого', function(){
	var testTree = $.extend(true, {}, tree);
	
	testTree.t = 3;
	
	var r1 = {
		keys: ['G', 'M'],
		childs: [
			{
				keys: ['C'],
				childs: []
			},
			{
				keys: ['H', 'I', 'K'],
				childs: []
			},
			{
				keys: ['O', 'Q', 'S'],
				childs: []
			}
		]
	};
	
	var res1 = {
		keys: ['H', 'M'],
		childs: [
			{
				keys: ['C', 'G'],
				childs: []
			},
			{
				keys: ['I', 'K'],
				childs: []
			},
			{
				keys: ['O', 'Q', 'S'],
				childs: []
			}
		]
	};
	
	testTree.merge(r1.childs[0], 0, r1);
	deepEqual(r1, res1, 'df');
});

test('забор для среднего у правого', function(){
	var testTree = $.extend(true, {}, tree);
	
	testTree.t = 3;
	
	var r1 = {
		keys: ['G', 'M'],
		childs: [
			{
				keys: ['A', 'B'],
				childs: []
			},
			{
				keys: ['H'],
				childs: []
			},
			{
				keys: ['O', 'Q', 'S'],
				childs: []
			}
		]
	};
	
	var res1 = {
		keys: ['G', 'O'],
		childs: [
			{
				keys: ['A', 'B'],
				childs: []
			},
			{
				keys: ['H', 'M'],
				childs: []
			},
			{
				keys: ['Q', 'S'],
				childs: []
			}
		]
	};
	testTree.merge(r1.childs[1], 1, r1);
	deepEqual(r1, res1, 'df');
});

test('забор для крайнего правого', function(){
	var testTree = $.extend(true, {}, tree);
	
	testTree.t = 3;
	
	var r1 = {
		keys: ['G', 'M'],
		childs: [
			{
				keys: ['A', 'B', 'C'],
				childs: []
			},
			{
				keys: ['H', 'I', 'K'],
				childs: []
			},
			{
				keys: ['S'],
				childs: []
			}
		]
	};
	
	var res1 = {
		keys: ['G', 'K'],
		childs: [
			{
				keys: ['A', 'B', 'C'],
				childs: []
			},
			{
				keys: ['H', 'I'],
				childs: []
			},
			{
				keys: ['M', 'S'],
				childs: []
			}
		]
	};
	testTree.merge(r1.childs[2], 2, r1);
	deepEqual(r1, res1, 'df');
});

test('слияние крайнего левого', function(){
	var testTree = $.extend(true, {}, tree);
	
	testTree.t = 3;
	
	var r1 = {
		keys: ['C', 'F'],
		childs: [
			{
				keys: ['A'],
				childs: []
			},
			{
				keys: ['D', 'E'],
				childs: []
			},
			{
				keys: ['G', 'H'],
				childs: []
			}
		]
	};
	
	var res1 = {
		keys: ['F'],
		childs: [
			{
				keys: ['A', 'C', 'D', 'E'],
				childs: []
			},
			{
				keys: ['G', 'H'],
				childs: []
			}
		]
	};
	testTree.merge(r1.childs[0], 0, r1);
	deepEqual(r1, res1, 'df');
});

test('слияние среднего', function(){
	var testTree = $.extend(true, {}, tree);
	
	testTree.t = 3;
	
	var r1 = {
		keys: ['C', 'F'],
		childs: [
			{
				keys: ['A', 'B'],
				childs: []
			},
			{
				keys: ['D'],
				childs: []
			},
			{
				keys: ['G', 'H'],
				childs: []
			}
		]
	};
	
	var res1 = {
		keys: ['F'],
		childs: [
			{
				keys: ['A', 'B', 'C', 'D'],
				childs: []
			},
			{
				keys: ['G', 'H'],
				childs: []
			}
		]
	};
	testTree.merge(r1.childs[1], 1, r1);
	deepEqual(r1, res1, 'df');
});

test('слияние крайнего правого', function(){
	var testTree = $.extend(true, {}, tree);
	
	testTree.t = 3;
	
	var r1 = {
		keys: ['C', 'F'],
		childs: [
			{
				keys: ['A', 'B'],
				childs: []
			},
			{
				keys: ['D', 'E'],
				childs: []
			},
			{
				keys: ['G'],
				childs: []
			}
		]
	};
	
	var res1 = {
		keys: ['C'],
		childs: [
			{
				keys: ['A', 'B'],
				childs: []
			},
			{
				keys: ['D', 'E', 'F', 'G'],
				childs: []
			}
		]
	};
	testTree.merge(r1.childs[2], 2, r1);
	treeView.tree = r1;
	treeView.render();
	deepEqual(r1, res1, 'df');
});
