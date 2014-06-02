'use strict';

var doc = document;

function exists(v) {
	return v != null;
};

Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

doc.getSvg = function(type, props) {
	var el = doc.createElementNS("http://www.w3.org/2000/svg", type);
	if (typeof props) {
		el.setAttr(props);
	}
	return el;
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
	if (typeof attr == 'object') {
		for (var k in attr) {
			this.setAttributeNS(null, k, attr[k]);
		};
	} else {
		this.setAttributeNS(null, attr, val);
	}
	
	return this;
}


var tree = {
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
			}
			else {
				// для того, чтобы удалить ключ, надо позаимствовать ключ из дочерней ноды и 
				// вызвать для нее рекурсивное удаления заимствованного ключа
				if (exists(node.childs[j]) && node.childs[j].keys.length > this.t - 1) {
					node.keys[j] = this.removeMax(node, node.childs[j]);
				} else if (exists(node.childs[j + 1]) && node.childs[j + 1].keys.length > this.t - 1) {
					node.keys[j] = this.removeMin(node, node.childs[j + 1]);
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
	},
	
	testTree: function() {
		try {
			this._testTree(null, 0, this.root);
			return true;
		} catch(e) {
			console.log(e);
			return false;
		}
	},
	
	_testTree: function(parent, i, node) {
		
		if (node !== this.root) {
			if (node.keys.length < this.t - 1 || node.keys.length > 2 * this.t - 1) throw('Error, invalid tree');
			if (node.childs.length !== 0 && (node.childs.length < this.t || node.childs.length > 2 * this.t)) {console.log(node); throw('Ошибка 2, дерево невалидно!');}
		} else {
			if (node.keys.length < 1 || node.keys.length > 2 * this.t - 1) {console.log(node); throw('Error, invalid tree');}
			if (node.childs.length > 2 * this.t) {console.log(node); throw('Error, invalid tree');}
		}
		
		if (node.childs.length > 0) {
			for (var n = 0; n < node.keys.length - 1; n++) {
				if (node.keys[n] >= node.keys[n + 1]) throw('Error, invalid tree');
				if (node.keys[n] <= this._testTree(node, n, node.childs[n])) throw('Error, invalid tree');
			}
			var nn = node.keys.length - 1;
			if (node.keys[nn] <= this._testTree(node, nn, node.childs[nn])) throw('Error, invalid tree');
			if (node.keys[nn] >= this._testTree(node, nn + 1, node.childs[nn + 1])) throw('Error, invalid tree');
		} else {
			//leaf
			for (var j = 1; j < node.keys.length; j++) {
				if (node.keys[j] < node.keys[j - 1]) throw('Error, invalid tree');
			}
		}
		
		return node.keys[node.keys.length - 1];
	},
	
	fillTree: function() {
		var me = this;
		me.root = {keys: [], childs: []};
		'ZmCogBlreIGUpKzxwyhqbnFETtRHkvJjLDsfuXcQOPVAWiaSYdNM'.split('').forEach(function(v) {
			me.add(v);
		});
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
		vals = vals.join(',');
		var container = doc.getSvg('g');
		var fs = Math.floor(24 - 2 * k);
		
		var w = fs * vals.length * 0.85;
		
		var obj = doc.getSvg('rect', {
			x     : x - w / 2,
			y     : y - 25,
			width : w,
			height: 35,
			class : 'node'
		});
		
		var text = doc.getSvg('text', {
			x          : x - w / 4,
			y          : y - 3,
			class      : 'node-text',
			'font-size': fs
		});
		
		if (prev) {
			var line = doc.getSvg('line', {
				x1   : prev.x,
				y1   : prev.y + 10,
				x2   : x,
				y2   : y,
				class: 'line'
			});
			doc.ge('area').appendChild(line);
		}
		
		text.appendChild(doc.createTextNode(vals));
		
		container.appendChild(obj);
		container.appendChild(text);
		doc.ge('area').appendChild(container);
	},
	
	remove: function(val) {
		this.tree.remove(val);
		this.redraw();
	},
	
	fillTree: function() {
		tree.fillTree();
	}
};

doc.ge('add-elem-but').on('click', function() {
	var val = doc.ge('new-elem').value;
	if (val == '') return alert('value for add is empty');
	treeView.add(val);
	doc.ge('new-elem').value = '';
});

doc.ge('remove-elem-but').on('click', function() {
	var val = doc.ge('removed-elem').value;
	if (val == '') return alert('value for remove is empty');
	treeView.remove(val);
	doc.ge('removed-elem').value = '';
});

doc.ge('set-tree-t').on('click', function() {
	var t = doc.ge('tree-t').value;
	
	if (t == '') return alert('t is empty');
	
	t = parseInt(t);
	
	if (t < 2) return alert('error, t must be greater then 2');
	
	tree.t = t;
	treeView.fillTree();
	treeView.redraw();
});

tree.t = 3;

treeView.tree = tree;
treeView.fillTree();
treeView.render();