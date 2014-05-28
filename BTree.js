/**
 * B-дерево
 *
 * http://neerc.ifmo.ru/wiki/index.php?title=B-%D0%B4%D0%B5%D1%80%D0%B5%D0%B2%D0%BE#.D0.A3.D0.B4.D0.B0.D0.BB.D0.B5.D0.BD.D0.B8.D0.B5_.D0.BA.D0.BB.D1.8E.D1.87.D0.B0
 * http://habrahabr.ru/post/114154/
 * http://ru.wikipedia.org/wiki/B-%D0%B4%D0%B5%D1%80%D0%B5%D0%B2%D0%BE
 * http://citforum.ru/programming/theory/sorting/sorting2.shtml#5
 *
 * http://www.cse.ohio-state.edu/~gurari/course/cis680/cis6802.html#QQ2-45-87
 *
 * Каждый узел, кроме корня, содержит не менее t - 1 ключей, и каждый внутренний узел имеет
 *     по меньшей мере t дочерних узлов. Если дерево не является пустым, корень должен содержать
 *     как минимум один ключ.
 * Каждый узел, кроме корня, содержит не более 2t - 1 ключей и не более чем 2t сыновей во внутренних узлах
 * Корень содержит от 1 до 2t - 1 ключей, если дерево не пусто и от 2 до 2t детей при высоте большей 0.
 * Каждый узел дерева, кроме листьев, содержащий ключи k_1, ..., k_n, имеет n + 1 сына. i-й сын
 *     содержит ключи из отрезка [k_{i - 1}; k_i],\:  k_0 = -\infty,\: k_{n + 1} = \infty.
 * Ключи в каждом узле упорядочены по неубыванию.
 * Все листья находятся на одном уровне.
 *
 * t >= 2
 *
 * t -1 <= node.keys <= 2t -1
 * t <= node.childs <= 2t
 *
 * 1 <= root.keys <= 2t - 1
 * 2t <= root.childs <= 2t
 *
 * h <= logt((n + 1) / 2)
 */

'use strict';

function exists(v) {
	return typeof v !== 'undefined'
};

Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};
var doc = document;

doc.getSvg = function(type) {
	return doc.createElementNS("http://www.w3.org/2000/svg", type);
}

Element.prototype.on = doc.addEventListener;

doc.ge = function(id) {
	return doc.getElementById(id);
}

doc.geByClass = function(classNmae) {
	return doc.getElementsByClassName(classNmae);
}

doc.geByClass1 = function(classNmae) {
	return doc.getElementsByClassName(classNmae)[0];
}

Element.prototype.setAttr = function(attr, val) {
	this.setAttributeNS(null, attr, val);
	return this;
}

var tree = {
	t: 3,
	
	add: function(val) {
		var node = this.root;
		this._add(null, node, val);
		if (node.keys.length >= (2 * this.t) - 1) {
			var leftNode = {
				keys: node.keys.slice(0, this.t - 1),
				childs: node.childs.slice(0, this.t)
			};
			var rightNode = {
				keys: node.keys.slice(this.t),
				childs: node.childs.slice(this.t)
			};
			var parent = {
				keys: [node.keys[this.t - 1]],
				childs: [leftNode, rightNode]
			};
			this.root = parent;
		}
	},
	
	_add: function(parent, node, val) {
		if (node.childs.length > 0) {
			var j;
			if (val < node.keys[0]) {
				j = 0;
			} else if (val > node.keys[node.keys.length - 1]) {
				j = node.keys.length;
			} else {
				for (var i = 0; i < node.keys.length; i++) {
					if (val === node.keys[i]) return;
					if (val > node.keys[i] && val < node.keys[i + 1]) {
						j = i + 1;
					}
				}
			}
			this._add(node, node.childs[j], val);
			if (node.childs[j].keys.length > (2 * this.t) - 1) {
				this.split(node, j);
			}
		} else {
			var pos;
			if (val < node.keys[0]) {
				pos = 0;
			} else if (val > node.keys[node.keys.length - 1]) {
				pos = node.keys.length;
			} else {
				for (var i = 0; i < node.keys.length; i++) {
					if (val === node.keys[i]) return;
					if (val > node.keys[i] && val < node.keys[i + 1]) {
						pos = i + 1;
						break;
					}
				}
			}
			node.keys = [].concat(node.keys.slice(0, pos), val, node.keys.slice(pos));
		}
	},
	
	findInNode: function(node, val){
		var num = -1;
		for (var i = 0; i < node.keys.length; i++) {
			if (node.keys[i] === val) {
				num = i;
				break;
			}
		}
		return num;
	},
	
	split: function(parent, i) {
		var node = parent.childs[i];
		var leftNode = {
			keys: node.keys.slice(0, this.t),
			childs: node.childs.slice(0, this.t + 1)
		};
		var rightNode = {
			keys: node.keys.slice(this.t + 1),
			childs: node.childs.slice(this.t + 1)
		};
		parent.childs.push(0);
		for (var j = parent.childs.length - 1; j > i; j--) {
			parent.childs[j] = parent.childs[j - 1];
		}
		parent.childs[i] = leftNode;
		parent.childs[i + 1] = rightNode;
		parent.keys.push(0);
		for (var j = parent.keys.length - 1; j > i; j--) {
			parent.keys[j] = parent.keys[j - 1];
		}
		parent.keys[i] = node.keys[this.t];
	},
	
	remove: function(val) {
		var node = this.root;
		this._remove(null, node, 0, val);
		//if (node.keys.length == 0) {
		//	var newRoot = {
		//		childs: [].concat(node.childs[0].childs, node.childs[1].childs),
		//		keys: [].concat(node.keys[0].childs, node.keys[1].childs)
		//	}
		//	this.root = newRoot;
		//}
	},
	
	// удаление элемента из дочернего узла или листа
	_remove: function(parent, node, i, val) {
		// узел
		if (node.childs.length > 0) {
			// пытаемся найти ключ для удаления в текущей ноде
			var j = this.findInNode(node, val);
			
			// ключа для удаленияне не нашлось - отправляемся искать в дочерние
			if (j === -1) {
				if (val < node.keys[0]) {
					j = 0;
				} else if (val > node.keys[node.keys.length - 1]) {
					j = node.keys.length;
				} else {
					for (var i = 0; i < node.keys.length; i++) {
						if (val === node.keys[i]) return;
						if (val > node.keys[i] && val < node.keys[i + 1]) {
							j = i + 1;
						}
					}
				}
				
				this._remove(node, node.childs[j], j, val);
				if (node.keys.length < this.t - 1) this.mergeNodes(parent, node, i, val);
				//if (parent) this.merge(parent, i);
				// здесь нужна проверка на количество элементов в узле после удаления
			} // ключ для удаления находится в текущей ноде
			else {
				// для того, чтобы удалить ключ, надо позаимствовать ключ из дочерней ноды и 
				// вызвать для нее рекурсивное удаления заимствованного ключа
				if (exists(node.childs[j]) && node.childs[j].keys.length > this.t - 1) {
					var max = this.removeMax(node, node.childs[j]);
					node.keys[j] = max;
					//node.keys[j] = node.childs[j].keys[node.childs[j].keys.length - 1];
					//this._remove(node, node.childs[j], j, node.childs[j].keys[node.childs[j].keys.length - 1]);
					
				} else if (exists(node.childs[j + 1]) && node.childs[j + 1].keys.length > this.t - 1) {
					var min = this.removeMin(node, node.childs[j + 1]);
					node.keys[j] = min;
					//node.keys[j] = node.childs[j + 1].keys[0];
					//this._remove(node, node.childs[j + 1], j, node.childs[j + 1].keys[0]);
				} else if (node.keys.length > this.t - 1) {
					var next = j + 1, prev = j;
					var newNode = {
						keys  : [].concat(node.childs[prev].keys, node.keys[j], node.childs[next].keys),
						childs: [].concat(node.childs[prev].childs, node.childs[next].childs),
					};
					node.keys.remove(j);
					node.childs.remove(next);
					node.childs[prev] = newNode;
					this._remove(node, node.childs[j], j, val);
					
					if (node == this.root && node.keys.length == 0) this.root = newNode;
				} else {
					// забор ноды у соседа
					node = this.mergeNodes(parent, node, i, val);
					this._remove(parent, node, i, val);
				}
			}
		} // лист
		else {
			// удаляем ключ
			var j = this.findInNode(node, val);
			if (j >= 0) {
				//node.keys = [].concat(node.keys.slice(0, j), node.keys.slice(j + 1));
				node.keys.remove(j);
				this.merge(parent, i);
			}
		}
	},
	
	// если в листе после удаления окажется недостаточно элементов,
	// элемент будет забран у соседа или объединен с соседним
	merge: function(parent, i) {
		var node = parent.childs[i];
		if (node.keys.length < this.t - 1) {
			if (exists(parent.childs[i + 1]) && parent.childs[i + 1].keys.length > this.t - 1) {
				node.keys.push(parent.keys[i]);
				parent.keys[i] = parent.childs[i + 1].keys[0];
				parent.childs[i + 1].keys.shift();
			} else if (exists(parent.childs[i - 1]) && parent.childs[i - 1].keys.length > this.t - 1) {
				node.keys.unshift(parent.keys[i - 1]);
				parent.keys[i - 1] = parent.childs[i - 1].keys[parent.childs[i - 1].keys.length - 1];
				parent.childs[i - 1].keys.pop();
			} else {
				var next = i + 1, prev = i - 1;
				
				var newNode = {keys: [], childs: []};
				if (exists(parent.childs[prev])) {
					newNode.keys = [].concat(parent.childs[prev].keys, parent.keys[i - 1], node.keys);
					parent.keys.remove(i - 1);
				} else if (exists(parent.childs[next])) {
					newNode.keys = [].concat(node.keys, parent.keys[i], parent.childs[next].keys);
					parent.keys.remove(i);
				}
				parent.childs[i] = newNode;
				
				if (exists(parent.childs[prev])) {
					parent.childs.remove(prev);
				} else if (exists(parent.childs[next])) {
					parent.childs.remove(next);
				}
			}
		}
	},
	
	mergeNodes: function(parent, node, i, val) {
		if (parent != null) {
			var resNode = parent.childs[i];
			
			if (exists(parent.childs[i - 1]) && parent.childs[i - 1].keys.length > this.t -1) {
				// здесь, по-ходу, нельзя использовать shift
				// TODO проверить!
				node.keys.unshift(parent.keys[i - 1]);
				node.childs.unshift(parent.childs[i - 1].childs.pop());
				parent.keys[i - 1] = parent.childs[i - 1].keys.pop();
			} else if (exists(parent.childs[i + 1]) && parent.childs[i + 1].keys.length > this.t - 1) {
				node.keys.push(parent.keys[i]);
				node.childs.push(parent.childs[i + 1].childs.shift());
				parent.keys[i] = parent.childs[i + 1].keys.shift();
			} else {
				// у соседних нод тоже минимальное количество ключей
				// надо выполнить слияние нод
				if (exists(parent.childs[i - 1])) {
					var sibling =  parent.childs[i - 1];
					var newNode = {
						keys: [].concat(sibling.keys, parent.keys[i - 1], node.keys),
						childs: [].concat(sibling.childs, node.childs),
					};
					parent.childs[i] = newNode;
					parent.keys.remove(i - 1);
					parent.childs.remove(i - 1);
				} else if (exists(parent.childs[i + 1])) {
					var sibling =  parent.childs[i + 1];
					var newNode = {
						keys: [].concat(node.keys, parent.keys[i], sibling.keys),
						childs: [].concat(node.childs, sibling.childs),
					};
					parent.childs[i] = newNode;
					parent.keys.remove(i);
					parent.childs.remove(i + 1);
				}
				resNode = newNode;
			}
		} else {
			if (node.keys.length == 0) this.root = node.childs[0];
			resNode = this.root;
		}
		return resNode;
	},
	
	removeMin: function(parent, node) {
		if (node.childs.length > 0) {
			return this.removeMin(node, node.childs[0]);
		} else {
			var res = node.keys[0];
			this._remove(parent, node, 0, node.keys[0]);
			return res;
		}
	},
	
	removeMax: function(parent, node) {
		if (node.childs.length > 0) {
			return this.removeMax(node, node.childs[node.childs.length - 1]);
		} else {
			var res = node.keys[node.keys.length - 1];
			this._remove(parent, node, parent.childs.length - 1, node.keys[node.keys.length - 1]);
			return res;
		}
	}
};

var treeView = {
	
	add: function(val) {
		this.tree.add(val);
		this.redraw();
	},
	
	//для отрисовки B-дерева надо знать количество узлов на одном уровне
	//это сделать можно, если предварительно пройтись по B-дереву и посчитать количество узлов на каждом уровне
	renderConsole: function(tree) {
		if (tree == null) tree = this.tree.root;
		this._renderConsole(tree, 0);
	},
	
	/**
	 *
	 */
	_renderConsole: function(node, shift_len) {
		var shift = '';
		for (var i = 0; i < shift_len; i++) {
			shift += ' ';
		}
		shift_len += 4;
		console.log(shift + node.keys.join(', '));
		for (var i = 0; i < node.childs.length; i++) {
			this._renderConsole(node.childs[i], shift_len);
		}
	},
	
	/**
	 * Remove all nodes from area
	 */
	clear: function(){
		var nodes = doc.ge('area').childNodes;
		var len = nodes.length;
		for (var i = 0; i < len; i++) {
			doc.ge('area').removeChild(nodes[0]);
		}
	},
	
	/**
	 * Redraw heap
	 */
	redraw: function(){
		this.clear();
		this.render();
	},
	
	render: function() {
		this._render(this.tree.root, window.screen.width, 110, 100, 0, null, 1);
	},
	
	_render: function(node, width, y, r, offset, prev, k) {
		this.renderNode(node.keys, width / 2 + offset, y, r, prev, k);
		var w = width / node.childs.length;
		var prev = {x: width / 2 + offset, y: y};
		y += 100;
		r = r / 2;
		for (var i = 0; i < node.childs.length; i++) {
			this._render(node.childs[i], w, y, r, offset, prev, k * 2);
			offset += w;
		}
	},
	
	/**
	 * Draw node
	 * @param {Int} val Node value
	 * @param {Int} x Position left
	 * @param {Int} y Position top
	 * @param {Int} r Radius
	 */
	renderNode: function(vals, x, y, r, prev, k) {
		var container = doc.getSvg('g');
		
		var obj = doc.getSvg('rect')
			.setAttr('x', x - 200 / (2 * k))
			.setAttr('y', y - 25)
			.setAttr('width', 200 / k)
			.setAttr('height', 35)
			.setAttr('class', 'node');
		
		var text = doc.getSvg('text')
			.setAttr('x', x - vals.length * 6)
			.setAttr('y', y - 3)
			.setAttr('class', 'node-text')
			.setAttr('font-size', Math.floor(24 - 3 * k));
		
		if (prev) {
			var line = doc.getSvg('line')
				.setAttr('x1', prev.x)
				.setAttr('y1', prev.y + 10)
				.setAttr('x2', x)
				.setAttr('y2', y)
				.setAttr('class', 'line');
			doc.ge('area').appendChild(line);
		}
		
		text.appendChild(doc.createTextNode(vals.join(', ')));
		
		container.appendChild(obj);
		container.appendChild(text);
		doc.ge('area').appendChild(container);
	},
	
	remove: function(val) {
		this.tree.remove(val);
		this.redraw();
	}
};


tree.root = {keys: ['a'], childs: []};
tree.root = {
	keys: ['G'],
	childs: [
		{
			keys: ['A', 'D'],
			childs: [
				{keys: ['1', '2', '3'], childs: []},
				{keys: ['B', 'C'], childs: []},
				{keys: ['E', 'F'], childs: []}
			]
		},
		{
			keys: ['O', 'W'],
			childs: [
				{keys: ['L', 'M', 'N'], childs: []},
				{keys: ['P', 'Q', 'R'], childs: []},
				{keys: ['X', 'Y', 'Z'], childs: []}
			]
		}
	]
};
tree.add('S');
tree.add('H');
tree.add('I');
tree.add('J');
//tree.add('K');
//tree.add('T');
//tree.add('U');
//tree.add('V');
//tree.add('a');
//tree.add('b');
//tree.add('c');
//tree.add('d');
//tree.add('e');
//tree.add('f');
//tree.add('g');
//tree.remove('X');
//tree.remove('b');
//tree.remove('a');
//tree.remove('A');
//tree.remove('Y');
//tree.remove('Z');
//tree.remove('V');
//tree.remove('c');

treeView.tree = tree;
treeView.render();